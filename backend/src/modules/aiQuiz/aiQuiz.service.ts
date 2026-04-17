import { AIQuizDifficulty, Prisma } from "@prisma/client";
import { z } from "zod";
import config from "../../../config.ts";
import { client } from "../../prisma/db.ts";

type GenerateQuizInput = {
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  numberOfQuestions: string | number;
  topic?: string;
};

type SubmitAnswerInput = {
  questionId: string;
  selectedAnswer: string;
};

type HistoryQuery = {
  page?: string | number;
  limit?: string | number;
};

const GEMINI_API_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_RETRY_DELAYS_MS = [1000, 2500];

const aiQuizResponseSchema = z.object({
  title: z.string().trim().min(1),
  questions: z.array(
    z.object({
      question: z.string().trim().min(1),
      options: z.array(z.string().trim().min(1)).length(4),
      correctAnswer: z.string().trim().min(1),
      explanation: z.string().trim().min(1),
      difficulty: z.enum(["easy", "medium", "hard"]),
      topic: z.string().trim().optional().default("General"),
    }),
  ),
});

const difficultyMap: Record<GenerateQuizInput["difficulty"], AIQuizDifficulty> = {
  easy: AIQuizDifficulty.EASY,
  medium: AIQuizDifficulty.MEDIUM,
  hard: AIQuizDifficulty.HARD,
};

const difficultyLabelMap: Record<AIQuizDifficulty, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

const toPositiveNumber = (value: string | number | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const createHttpError = (message: string, statusCode = 400) => {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const repairInvalidJsonEscapes = (value: string) =>
  value.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");

const parseGeminiQuizJson = (rawText: string) => {
  const cleanedText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return aiQuizResponseSchema.parse(JSON.parse(cleanedText));
  } catch (error) {
    if (
      error instanceof SyntaxError &&
      /invalid escape/i.test(error.message)
    ) {
      return aiQuizResponseSchema.parse(
        JSON.parse(repairInvalidJsonEscapes(cleanedText)),
      );
    }

    throw error;
  }
};

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const getGeminiModels = () => {
  const fallbackModels = config.GEMINI_FALLBACK_MODELS.split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  return [config.GEMINI_MODEL, ...fallbackModels].filter(
    (model, index, list) => list.indexOf(model) === index,
  );
};

const isRetryableGeminiError = (statusCode: number | undefined, message: string) => {
  const normalizedMessage = message.toLowerCase();

  return (
    statusCode === 429 ||
    statusCode === 503 ||
    normalizedMessage.includes("high demand") ||
    normalizedMessage.includes("try again later") ||
    normalizedMessage.includes("temporarily unavailable") ||
    normalizedMessage.includes("overloaded")
  );
};

const normalizeOptionLabel = (value: string) => value.trim().toUpperCase();

const normalizeCorrectAnswer = (options: string[], rawCorrectAnswer: string) => {
  const directMatch = options.find(
    (option) => option.trim().toLowerCase() === rawCorrectAnswer.trim().toLowerCase(),
  );

  if (directMatch) {
    return directMatch;
  }

  const labels = ["A", "B", "C", "D"];
  const labelIndex = labels.indexOf(normalizeOptionLabel(rawCorrectAnswer));

  if (labelIndex >= 0 && options[labelIndex]) {
    return options[labelIndex];
  }

  throw createHttpError("AI quiz response contained an invalid correct answer", 502);
};

const buildQuizTitle = (subject: string, difficulty: AIQuizDifficulty, topic?: string | null) => {
  const parts = [subject, difficultyLabelMap[difficulty], "Quiz"];

  if (topic) {
    parts.unshift(topic);
  }

  return parts.join(" - ");
};

const getStudentContext = async (studentId: string) => {
  const student = await client.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      studentName: true,
      classId: true,
      class: {
        select: {
          id: true,
          slug: true,
          section: true,
          session: true,
        },
      },
    },
  });

  if (!student?.class) {
    throw createHttpError("Student class not found", 404);
  }

  return student;
};

const ensureSubjectBelongsToStudentClass = async (classId: string, subject: string) => {
  const existingSubject = await client.subject.findFirst({
    where: {
      classId,
      name: {
        equals: subject,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!existingSubject) {
    throw createHttpError("Subject does not belong to your class", 400);
  }

  return existingSubject.name;
};

const enforceGenerationRateLimit = async (studentId: string) => {
  const windowStart = new Date(Date.now() - 15 * 60 * 1000);

  const generationCount = await client.aIQuiz.count({
    where: {
      studentId,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  if (generationCount >= 5) {
    throw createHttpError(
      "Too many AI quiz generations. Please wait a few minutes before trying again.",
      429,
    );
  }
};

const callGeminiForQuiz = async ({
  model,
  classLabel,
  subject,
  difficulty,
  numberOfQuestions,
  topic,
}: {
  model: string;
  classLabel: string;
  subject: string;
  difficulty: GenerateQuizInput["difficulty"];
  numberOfQuestions: number;
  topic?: string;
}) => {
  if (!config.GEMINI_API_KEY) {
    throw createHttpError("GEMINI_API_KEY is not configured", 500);
  }

  const prompt = `
Generate a school quiz in strict JSON only.

Class: ${classLabel}
Subject: ${subject}
Difficulty: ${difficulty}
Number of questions: ${numberOfQuestions}
Topic: ${topic || "General chapter coverage"}

Rules:
- Return valid JSON only
- No markdown
- No explanation outside JSON
- Exactly ${numberOfQuestions} multiple-choice questions
- Each question must have exactly 4 options
- "correctAnswer" must be either the exact option text or one of A/B/C/D
- Keep content appropriate for ${classLabel}
- Do not use LaTeX
- Do not use backslashes in any value
- Use plain text math like sqrt(x), x^2, integral of x^2, pi, theta

JSON shape:
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "string",
      "difficulty": "easy | medium | hard",
      "topic": "string"
    }
  ]
}
  `.trim();

  const response = await fetch(
    `${GEMINI_API_BASE_URL}/${model}:generateContent?key=${config.GEMINI_API_KEY}`,
    {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    }),
    },
  );

  if (!response.ok) {
    let upstreamMessage = "Gemini API request failed";

    try {
      const errorBody = await response.json();
      upstreamMessage =
        errorBody?.error?.message ||
        errorBody?.message ||
        upstreamMessage;
    } catch {
      try {
        const rawText = await response.text();
        if (rawText) {
          upstreamMessage = rawText;
        }
      } catch {
        void 0;
      }
    }

    throw createHttpError(upstreamMessage, response.status >= 500 ? 502 : response.status);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? "")
    .join("");

  if (!rawText) {
    throw createHttpError("Gemini returned an empty quiz response", 502);
  }

  return parseGeminiQuizJson(rawText);
};

const generateQuizWithGemini = async (params: {
  classLabel: string;
  subject: string;
  difficulty: GenerateQuizInput["difficulty"];
  numberOfQuestions: number;
  topic?: string;
}) => {
  const models = getGeminiModels();
  let lastError: unknown = null;

  for (const model of models) {
    for (let attempt = 0; attempt <= GEMINI_RETRY_DELAYS_MS.length; attempt += 1) {
      try {
        return await callGeminiForQuiz({
          model,
          ...params,
        });
      } catch (error) {
        lastError = error;
        const statusCode =
          error instanceof Error && "statusCode" in error && typeof error.statusCode === "number"
            ? error.statusCode
            : undefined;
        const message = getErrorMessage(error, "Gemini API request failed");

        if (!isRetryableGeminiError(statusCode, message)) {
          throw error;
        }

        if (attempt < GEMINI_RETRY_DELAYS_MS.length) {
          await sleep(GEMINI_RETRY_DELAYS_MS[attempt]);
          continue;
        }
      }
    }
  }

  throw lastError ?? createHttpError("Gemini API request failed", 502);
};

const cloneFallbackQuiz = async ({
  studentId,
  classId,
  subject,
  difficulty,
  topic,
  totalQuestions,
}: {
  studentId: string;
  classId: string;
  subject: string;
  difficulty: AIQuizDifficulty;
  topic?: string;
  totalQuestions: number;
}) => {
  const fallbackQuiz = await client.aIQuiz.findFirst({
    where: {
      classId,
      subject,
      difficulty,
      totalQuestions,
      ...(topic ? { topic: { equals: topic, mode: "insensitive" } } : {}),
    },
    include: {
      questions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!fallbackQuiz) {
    throw createHttpError("AI quiz generation failed. Please try again shortly.", 502);
  }

  return client.$transaction(async (tx) => {
    const quiz = await tx.aIQuiz.create({
      data: {
        studentId,
        classId,
        subject,
        topic: topic || null,
        difficulty,
        totalQuestions,
      },
    });

    await tx.aIQuizQuestion.createMany({
        data: fallbackQuiz.questions.map((question) => ({
          quizId: quiz.id,
          question: question.question,
          options: question.options as Prisma.InputJsonValue,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        difficulty: question.difficulty,
        topic: question.topic,
      })),
    });

    return tx.aIQuiz.findUnique({
      where: { id: quiz.id },
      include: { questions: true },
    });
  });
};

const serializeQuiz = (
  quiz: Prisma.AIQuizGetPayload<{ include: { questions: true } }>,
) => ({
  id: quiz.id,
  title: buildQuizTitle(quiz.subject, quiz.difficulty, quiz.topic),
  subject: quiz.subject,
  topic: quiz.topic,
  difficulty: quiz.difficulty.toLowerCase(),
  totalQuestions: quiz.totalQuestions,
  createdAt: quiz.createdAt,
  questions: quiz.questions.map((question) => ({
    id: question.id,
    question: question.question,
    options: (question.options as string[]) ?? [],
    difficulty: question.difficulty.toLowerCase(),
    topic: question.topic,
  })),
});

const buildResultAnalytics = ({
  questions,
  answerMap,
  score,
  total,
}: {
  questions: Array<{
    id: string;
    difficulty: AIQuizDifficulty;
    topic: string | null;
    correctAnswer: string;
  }>;
  answerMap: Map<string, { selectedAnswer: string; isCorrect: boolean }>;
  score: number;
  total: number;
}) => {
  const topicStats = new Map<
    string,
    { total: number; correct: number; incorrect: number }
  >();
  const difficultyStats: Record<string, { total: number; correct: number }> = {
    easy: { total: 0, correct: 0 },
    medium: { total: 0, correct: 0 },
    hard: { total: 0, correct: 0 },
  };

  questions.forEach((question) => {
    const answer = answerMap.get(question.id);
    const topic = question.topic || "General";
    const difficultyKey = question.difficulty.toLowerCase();

    if (!topicStats.has(topic)) {
      topicStats.set(topic, { total: 0, correct: 0, incorrect: 0 });
    }

    const currentTopic = topicStats.get(topic)!;
    currentTopic.total += 1;
    difficultyStats[difficultyKey].total += 1;

    if (answer?.isCorrect) {
      currentTopic.correct += 1;
      difficultyStats[difficultyKey].correct += 1;
    } else {
      currentTopic.incorrect += 1;
    }
  });

  const topicPerformance = Array.from(topicStats.entries()).map(([topic, stats]) => ({
    topic,
    total: stats.total,
    correct: stats.correct,
    incorrect: stats.incorrect,
    percentage: stats.total ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));

  const weakTopics = topicPerformance
    .filter((item) => item.percentage < 60)
    .map((item) => item.topic);

  return {
    score,
    total,
    percentage: total ? Number(((score / total) * 100).toFixed(2)) : 0,
    correctCount: score,
    incorrectCount: total - score,
    topicPerformance,
    weakTopics,
    difficultyDistribution: Object.entries(difficultyStats).map(([difficulty, stats]) => ({
      difficulty,
      total: stats.total,
      correct: stats.correct,
      incorrect: stats.total - stats.correct,
    })),
    suggestedNextDifficulty:
      total && score / total >= 0.8
        ? "hard"
        : total && score / total >= 0.55
          ? "medium"
          : "easy",
  };
};

const ensureQuizAttempt = async ({
  quizId,
  studentId,
  total,
}: {
  quizId: string;
  studentId: string;
  total: number;
}) => {
  const existingAttempt = await client.aIQuizAttempt.findUnique({
    where: {
      quizId_studentId: {
        quizId,
        studentId,
      },
    },
  });

  if (existingAttempt) {
    return existingAttempt;
  }

  try {
    return await client.aIQuizAttempt.create({
      data: {
        quizId,
        studentId,
        total,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const attempt = await client.aIQuizAttempt.findUnique({
        where: {
          quizId_studentId: {
            quizId,
            studentId,
          },
        },
      });

      if (attempt) {
        return attempt;
      }
    }

    throw error;
  }
};

export const generateQuiz = async (body: GenerateQuizInput, studentId: string) => {
  const student = await getStudentContext(studentId);
  await enforceGenerationRateLimit(studentId);

  const subject = await ensureSubjectBelongsToStudentClass(student.classId, body.subject);
  const totalQuestions = toPositiveNumber(body.numberOfQuestions, 5);
  const difficulty = difficultyMap[body.difficulty];
  const topic = body.topic?.trim() || undefined;
  const classLabel = `${student.class.slug} ${student.class.section}`.trim();

  let storedQuiz:
    | Prisma.AIQuizGetPayload<{ include: { questions: true } }>
    | null = null;

  try {
    const aiQuiz = await generateQuizWithGemini({
      classLabel,
      subject,
      difficulty: body.difficulty,
      numberOfQuestions: totalQuestions,
      topic,
    });

    storedQuiz = await client.$transaction(async (tx) => {
      const quiz = await tx.aIQuiz.create({
        data: {
          studentId,
          classId: student.classId,
          subject,
          topic: topic || null,
          difficulty,
          totalQuestions,
        },
      });

      await tx.aIQuizQuestion.createMany({
        data: aiQuiz.questions.map((question) => {
          const normalizedOptions = question.options.map((option) => option.trim());

          return {
            quizId: quiz.id,
            question: question.question.trim(),
            options: normalizedOptions,
            correctAnswer: normalizeCorrectAnswer(
              normalizedOptions,
              question.correctAnswer,
            ),
            explanation: question.explanation.trim(),
            difficulty: difficultyMap[question.difficulty],
            topic: question.topic?.trim() || topic || null,
          };
        }),
      });

      return tx.aIQuiz.findUnique({
        where: { id: quiz.id },
        include: { questions: true },
      });
    });
  } catch (error) {
    console.error("AI quiz generation failed:", getErrorMessage(error, "Unknown Gemini error"));

    try {
      storedQuiz = await cloneFallbackQuiz({
        studentId,
        classId: student.classId,
        subject,
        difficulty,
        topic,
        totalQuestions,
      });
    } catch {
      throw createHttpError(
        getErrorMessage(
          error,
          "AI quiz generation failed. Please try again shortly.",
        ),
        error instanceof Error && "statusCode" in error && typeof error.statusCode === "number"
          ? error.statusCode
          : 502,
      );
    }
  }

  if (!storedQuiz) {
    throw createHttpError("Unable to generate AI quiz", 500);
  }

  return {
    success: true,
    message: "AI quiz generated successfully",
    quiz: serializeQuiz(storedQuiz),
  };
};

export const startQuiz = async (quizId: string, studentId: string) => {
  const quiz = await client.aIQuiz.findFirst({
    where: {
      id: quizId,
      studentId,
    },
    include: {
      questions: true,
      attempts: {
        where: { studentId },
        take: 1,
      },
    },
  });

  if (!quiz) {
    throw createHttpError("Quiz not found", 404);
  }

  let attempt = quiz.attempts[0];

  if (!attempt) {
    attempt = await ensureQuizAttempt({
      quizId,
      studentId,
      total: quiz.totalQuestions,
    });
  }

  return {
    success: true,
    message: "Quiz started successfully",
    attempt: {
      id: attempt.id,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      isSubmitted: Boolean(attempt.submittedAt),
    },
    quiz: serializeQuiz(quiz),
  };
};

export const submitQuiz = async (
  quizId: string,
  answers: SubmitAnswerInput[],
  studentId: string,
) => {
  const quiz = await client.aIQuiz.findFirst({
    where: {
      id: quizId,
      studentId,
    },
    include: {
      questions: true,
      attempts: {
        where: { studentId },
        take: 1,
      },
    },
  });

  if (!quiz) {
    throw createHttpError("Quiz not found", 404);
  }

  const existingAttempt = quiz.attempts[0];

  if (existingAttempt?.submittedAt) {
    return getQuizResult(quizId, studentId);
  }

  const attempt =
    existingAttempt ??
    (await ensureQuizAttempt({
      quizId,
      studentId,
      total: quiz.totalQuestions,
    }));

  const answerMap = new Map(answers.map((answer) => [answer.questionId, answer.selectedAnswer]));
  const score = quiz.questions.reduce((total, question) => {
    const selectedAnswer = answerMap.get(question.id);

    if (!selectedAnswer) {
      return total;
    }

    return total + (selectedAnswer.trim() === question.correctAnswer.trim() ? 1 : 0);
  }, 0);

  const total = quiz.questions.length;
  const percentage = total ? Number(((score / total) * 100).toFixed(2)) : 0;

  await client.$transaction(async (tx) => {
    await tx.aIQuizAnswer.deleteMany({
      where: {
        attemptId: attempt.id,
      },
    });

    await tx.aIQuizAnswer.createMany({
      data: quiz.questions.map((question) => {
        const selectedAnswer = answerMap.get(question.id) ?? "";

        return {
          attemptId: attempt.id,
          questionId: question.id,
          selectedAnswer,
          isCorrect: selectedAnswer.trim() === question.correctAnswer.trim(),
        };
      }),
    });

    await tx.aIQuizAttempt.update({
      where: { id: attempt.id },
      data: {
        score,
        total,
        percentage,
        submittedAt: new Date(),
      },
    });
  });

  return getQuizResult(quizId, studentId);
};

export const getQuizResult = async (quizId: string, studentId: string) => {
  const quiz = await client.aIQuiz.findFirst({
    where: {
      id: quizId,
      studentId,
    },
    include: {
      questions: true,
      attempts: {
        where: { studentId },
        include: {
          answers: true,
        },
        take: 1,
      },
    },
  });

  if (!quiz) {
    throw createHttpError("Quiz not found", 404);
  }

  const attempt = quiz.attempts[0];

  if (!attempt?.submittedAt) {
    throw createHttpError("Quiz has not been submitted yet", 400);
  }

  const answerMap = new Map(
    attempt.answers.map((answer) => [
      answer.questionId,
      {
        selectedAnswer: answer.selectedAnswer,
        isCorrect: answer.isCorrect,
      },
    ]),
  );

  const analytics = buildResultAnalytics({
    questions: quiz.questions.map((question) => ({
      id: question.id,
      difficulty: question.difficulty,
      topic: question.topic,
      correctAnswer: question.correctAnswer,
    })),
    answerMap,
    score: attempt.score,
    total: attempt.total,
  });

  return {
    success: true,
    result: {
      quizId: quiz.id,
      title: buildQuizTitle(quiz.subject, quiz.difficulty, quiz.topic),
      subject: quiz.subject,
      topic: quiz.topic,
      difficulty: quiz.difficulty.toLowerCase(),
      createdAt: quiz.createdAt,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      score: attempt.score,
      total: attempt.total,
      percentage: attempt.percentage,
      analytics,
      questions: quiz.questions.map((question) => {
        const answer = answerMap.get(question.id);

        return {
          id: question.id,
          question: question.question,
          options: (question.options as string[]) ?? [],
          selectedAnswer: answer?.selectedAnswer ?? "",
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          isCorrect: answer?.isCorrect ?? false,
          difficulty: question.difficulty.toLowerCase(),
          topic: question.topic,
        };
      }),
    },
  };
};

export const getQuizHistory = async (studentId: string, query: HistoryQuery) => {
  const page = toPositiveNumber(query.page, 1);
  const limit = Math.min(toPositiveNumber(query.limit, 10), 30);
  const skip = (page - 1) * limit;

  const [attempts, total] = await Promise.all([
    client.aIQuizAttempt.findMany({
      where: {
        studentId,
        submittedAt: {
          not: null,
        },
      },
      skip,
      take: limit,
      orderBy: {
        startedAt: "desc",
      },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
        answers: true,
      },
    }),
    client.aIQuizAttempt.count({
      where: {
        studentId,
        submittedAt: {
          not: null,
        },
      },
    }),
  ]);

  return {
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    history: attempts.map((attempt) => {
      const answerMap = new Map(
        attempt.answers.map((answer) => [
          answer.questionId,
          {
            selectedAnswer: answer.selectedAnswer,
            isCorrect: answer.isCorrect,
          },
        ]),
      );

      const analytics = buildResultAnalytics({
        questions: attempt.quiz.questions.map((question) => ({
          id: question.id,
          difficulty: question.difficulty,
          topic: question.topic,
          correctAnswer: question.correctAnswer,
        })),
        answerMap,
        score: attempt.score,
        total: attempt.total,
      });

      return {
        quizId: attempt.quiz.id,
        title: buildQuizTitle(
          attempt.quiz.subject,
          attempt.quiz.difficulty,
          attempt.quiz.topic,
        ),
        subject: attempt.quiz.subject,
        topic: attempt.quiz.topic,
        difficulty: attempt.quiz.difficulty.toLowerCase(),
        totalQuestions: attempt.quiz.totalQuestions,
        createdAt: attempt.quiz.createdAt,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        score: attempt.score,
        total: attempt.total,
        percentage: attempt.percentage,
        weakTopics: analytics.weakTopics,
        suggestedNextDifficulty: analytics.suggestedNextDifficulty,
      };
    }),
  };
};
