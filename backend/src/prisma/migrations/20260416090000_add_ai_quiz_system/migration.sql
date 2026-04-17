CREATE TYPE "AIQuizDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

CREATE TABLE "AIQuiz" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "classId" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "topic" TEXT,
  "difficulty" "AIQuizDifficulty" NOT NULL,
  "totalQuestions" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AIQuiz_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AIQuizQuestion" (
  "id" TEXT NOT NULL,
  "quizId" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "options" JSONB NOT NULL,
  "correctAnswer" TEXT NOT NULL,
  "explanation" TEXT NOT NULL,
  "difficulty" "AIQuizDifficulty" NOT NULL,
  "topic" TEXT,

  CONSTRAINT "AIQuizQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AIQuizAttempt" (
  "id" TEXT NOT NULL,
  "quizId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "score" INTEGER NOT NULL DEFAULT 0,
  "total" INTEGER NOT NULL,
  "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "submittedAt" TIMESTAMP(3),

  CONSTRAINT "AIQuizAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AIQuizAnswer" (
  "id" TEXT NOT NULL,
  "attemptId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "selectedAnswer" TEXT NOT NULL,
  "isCorrect" BOOLEAN NOT NULL,

  CONSTRAINT "AIQuizAnswer_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AIQuiz_studentId_createdAt_idx" ON "AIQuiz"("studentId", "createdAt");
CREATE INDEX "AIQuiz_classId_subject_idx" ON "AIQuiz"("classId", "subject");
CREATE INDEX "AIQuizQuestion_quizId_idx" ON "AIQuizQuestion"("quizId");
CREATE UNIQUE INDEX "AIQuizAttempt_quizId_studentId_key" ON "AIQuizAttempt"("quizId", "studentId");
CREATE INDEX "AIQuizAttempt_studentId_startedAt_idx" ON "AIQuizAttempt"("studentId", "startedAt");
CREATE UNIQUE INDEX "AIQuizAnswer_attemptId_questionId_key" ON "AIQuizAnswer"("attemptId", "questionId");
CREATE INDEX "AIQuizAnswer_questionId_idx" ON "AIQuizAnswer"("questionId");

ALTER TABLE "AIQuiz"
  ADD CONSTRAINT "AIQuiz_studentId_fkey"
  FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AIQuiz"
  ADD CONSTRAINT "AIQuiz_classId_fkey"
  FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AIQuizQuestion"
  ADD CONSTRAINT "AIQuizQuestion_quizId_fkey"
  FOREIGN KEY ("quizId") REFERENCES "AIQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AIQuizAttempt"
  ADD CONSTRAINT "AIQuizAttempt_quizId_fkey"
  FOREIGN KEY ("quizId") REFERENCES "AIQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AIQuizAttempt"
  ADD CONSTRAINT "AIQuizAttempt_studentId_fkey"
  FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AIQuizAnswer"
  ADD CONSTRAINT "AIQuizAnswer_attemptId_fkey"
  FOREIGN KEY ("attemptId") REFERENCES "AIQuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AIQuizAnswer"
  ADD CONSTRAINT "AIQuizAnswer_questionId_fkey"
  FOREIGN KEY ("questionId") REFERENCES "AIQuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
