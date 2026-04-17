// @ts-nocheck
import { client } from "../../prisma/db.ts";
import { publish } from '../../services/events/eventBus.ts'

export const createExam = async (body, userId, role) => {
  const {
    title,
    examType,
    startDate,
    endDate,
    classId,
    subjects,
  } = body;

  if (!title || !examType || !classId || !subjects?.length) {
    throw new Error(
      "Title, exam type, class and subjects are required"
    );
  }

  if (role !== "teacher" && role !== "admin") {
    throw new Error("Unauthorized");
  }



  // Extract subject IDs
  const subjectIds = subjects.map((s) => s.subjectId);

  // Prevent duplicate subjects in same exam
  if (new Set(subjectIds).size !== subjectIds.length) {
    throw new Error(
      "Duplicate subjects are not allowed in the same exam"
    );
  }

  //  Validate subject belongs to this class
  const classSubjects = await client.subject.findMany({
    where: {
      classId,
      id: { in: subjectIds },
    },
    select: { id: true },
  });

  if (classSubjects.length !== subjectIds.length) {
    throw new Error(
      "One or more subjects do not belong to this class"
    );
  }

  //  Validate marks
  for (const subject of subjects) {
    if (!subject.subjectId || subject.totalMarks == null || subject.passingMarks == null) {
      throw new Error(
        "Each subject must have subjectId, totalMarks and passingMarks"
      );
    }

    if (subject.passingMarks > subject.totalMarks) {
      throw new Error(
        "Passing marks cannot be greater than total marks"
      );
    }
  }



  const students = await client.student.findMany({
    where: { classId },
    select: { id: true },
  });

  if (!students.length) {
    throw new Error("No students found in this class");
  }


  const exam = await client.$transaction(async (tx) => {

    const exam = await tx.exam.create({
      data: {
        title,
        examType,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        classId,
        teacherId: userId,
      },
    });

    publish("exam_created", {
      classId,
      examId: exam.id,
      title: exam.title
    })

    const examSubjects = await Promise.all(
      subjects.map((subject) =>
        tx.examSubject.create({
          data: {
            examId: exam.id,
            subjectId: subject.subjectId,
            syllabus: subject.syllabus || null,
            totalMarks: Number(subject.totalMarks),
            passingMarks: Number(subject.passingMarks),
          },
        })
      )
    );

    const resultsData = [];

    for (const examSubject of examSubjects) {
      for (const student of students) {
        resultsData.push({
          examSubjectId: examSubject.id,
          studentId: student.id,
        });
      }
    }

    await tx.examResult.createMany({
      data: resultsData,
    });

    return exam;
});



  return {
    success: true,
    message: "Exam created successfully",
    exam,
  };
};

export const getExamsByClass = async (classId) => {
  if (!classId) throw new Error("Class ID is required");

  const exams = await client.exam.findMany({
    where: { classId },
    include: {
      subjects: {
        include: {
          subject: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { exams };
};

export const updateExamStatus = async (examId, status, role) => {
  if (!examId) throw new Error("Exam ID required");

  const allowed = [
    "SCHEDULED",
    "ONGOING",
    "EVALUATION",
    "PUBLISHED",
    "CANCELLED",
  ];

  if (role !== "teacher" && role !== "admin") {
    throw new Error("Unauthorized");
  }

  if (!allowed.includes(status)) {
    throw new Error("Invalid exam status");
  }


  const existing = await client.exam.findUnique({
    where: { id: examId },
    select: { status: true },
  });

  if (!existing) throw new Error("Exam not found");

  //  Prevent modifying published exam
  if (existing.status === "PUBLISHED") {
    throw new Error("Published exam cannot be modified");
  }

  const exam = await client.exam.update({
    where: { id: examId },
    data: { status },
  });

  return {
    message: "Exam status updated successfully",
    exam,
  };
};

export const publishExam = async (examId, role) => {
  if (!examId) throw new Error("Exam ID required");

  if (role !== "teacher" && role !== "admin") {
    throw new Error("Unauthorized");
  }

  const exam = await client.exam.findUnique({
    where: { id: examId },
    include: {
      subjects: {
        include: {
          results: true,
        },
      },
    },
  });

  if (!exam) throw new Error("Exam not found");

  if (exam.status !== "EVALUATION") {
    throw new Error("Exam must be in evaluation stage before publishing.");
  }

  //  Check if any result has null marks
  const hasUnmarked = exam.subjects.some((subject) =>
    subject.results.some((result) => result.obtainedMarks === null)
  );  

  if (hasUnmarked) {
    throw new Error("All marks must be entered before publishing.");
  }

  const updated = await client.exam.update({
    where: { id: examId },
    data: { status: "PUBLISHED" },
  });

  return {
    message: "Exam published successfully",
    exam: updated,
  };
};

export const updateExamMarks = async (
  resultId,
  obtainedMarks,
  role,
  userId
) => {
  if (!resultId) throw new Error("Result ID required");

  const result = await client.examResult.findUnique({
    where: { id: resultId },
    include: {
      examSubject: {
        include: {
          exam: true,
        },
      },
    },
  });

  if (!result) throw new Error("Result not found");

  const exam = result.examSubject.exam;

  //  Prevent editing after publish
  if (exam.status === "PUBLISHED") {
    throw new Error("Cannot edit published exam");
  }

  //  Teacher ownership check
  if (role === "teacher" && exam.teacherId !== userId) {
    throw new Error("Unauthorized");
  }

  //  Validate marks range
  if (
    obtainedMarks < 0 ||
    obtainedMarks > result.examSubject.totalMarks
  ) {
    throw new Error("Invalid marks value");
  }

  const updated = await client.examResult.update({
    where: { id: resultId },
    data: { obtainedMarks },
  });

  return {
    message: "Marks updated successfully",
    result: updated,
  };
};


export const getSubjectResults = async (
  examId,
  subjectId,
  role,
  userId
) => {
  if (!examId || !subjectId) {
    throw new Error("Exam ID and Subject ID required");
  }

  //  Get exam with teacherId + status
  const exam = await client.exam.findUnique({
    where: { id: examId },
    select: {
      id: true,
      status: true,
      teacherId: true,
      classId: true,
    },
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  //  Teacher ownership validation
  if (role === "teacher" && exam.teacherId !== userId) {
    throw new Error("Unauthorized");
  }

  //  Get examSubject with students + marks
  const examSubject = await client.examSubject.findFirst({
    where: {
      examId,
      subjectId,
    },
    include: {
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
      exam: {
        select: {
          status: true,
        },
      },
      results: {
        include: {
          student: {
            select: {
              id: true,
              studentName: true,
              rollNumber: true,
            },
          },
        },
        orderBy: {
          student: {
            rollNumber: "asc",
          },
        },
      },
    },
  });

  if (!examSubject) {
    throw new Error("Subject not found in this exam");
  }

  return {
    message: "Subject results fetched successfully",
    examSubject,
  };
};



export const bulkUpdateMarks = async (
  updates,
  role,
  userId
) => {
  if (!updates?.length) {
    throw new Error("Marks data required");
  }

  //  First validate everything outside transaction
  const results = await client.examResult.findMany({
    where: {
      id: { in: updates.map((u) => u.resultId) },
    },
    include: {
      examSubject: {
        include: {
          exam: true,
        },
      },
    },
  });

  if (results.length !== updates.length) {
    throw new Error("Some results not found");
  }

  for (const result of results) {
    const exam = result.examSubject.exam;
    
    if (role === "teacher" && exam.teacherId !== userId) {
      throw new Error("Unauthorized");
    }
    
    if (exam.status === "PUBLISHED") {
      throw new Error("Cannot edit published exam");
    }


    const update = updates.find(
      (u) => u.resultId === result.id
    );

    if (
      update.obtainedMarks < 0 ||
      update.obtainedMarks > result.examSubject.totalMarks
    ) {
      throw new Error("Invalid marks value");
    }
  }

  //  Create update operations
  const operations = updates.map((item) =>
    client.examResult.update({
      where: { id: item.resultId },
      data: { obtainedMarks: Number(item.obtainedMarks) },
    })
  );

  //  Execute batch transaction (SAFE)
  await client.$transaction(operations);

  return {
    message: "Marks(Bluk) updated successfully",
  };
};



const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};


// export const getExamResultsOverview = async (examId) => {
//   if (!examId) throw new Error("Exam ID required");

//   const exam = await client.exam.findUnique({
//     where: { id: examId },
//     include: {
//       subjects: {
//         include: {
//           results: {
//             include: {
//               student: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!exam) throw new Error("Exam not found");

//   // Only allow viewing after publish
//   if (exam.status !== "PUBLISHED") {
//     throw new Error("Results not published yet");
//   }

//   const studentMap = {};

//   // Aggregate subject results per student
//   exam.subjects.forEach((subject) => {
//     subject.results.forEach((result) => {
//       const studentId = result.studentId;

//       if (!studentMap[studentId]) {
//         studentMap[studentId] = {
//           student: result.student,
//           totalObtained: 0,
//           totalMarks: 0,
//           failed: false,
//         };
//       }

//       studentMap[studentId].totalMarks += subject.totalMarks;

//       const obtained = result.obtainedMarks || 0;
//       studentMap[studentId].totalObtained += obtained;

//       if (obtained < subject.passingMarks) {
//         studentMap[studentId].failed = true;
//       }
//     });
//   });

//   let results = Object.values(studentMap).map((item) => {
//     const percentage =
//       item.totalMarks > 0
//         ? (item.totalObtained / item.totalMarks) * 100
//         : 0;

//     const roundedPercentage = Number(percentage.toFixed(2));

//     return {
//       student: item.student,
//       totalObtained: item.totalObtained,
//       totalMarks: item.totalMarks,
//       percentage: roundedPercentage,
//       grade: calculateGrade(roundedPercentage),
//       status: item.failed ? "FAIL" : "PASS",
//     };
//   });

//   // Sort by percentage descending
//   results.sort((a, b) => b.percentage - a.percentage);

//   //  Assign rank (handles ties)
//   let rank = 1;
//   for (let i = 0; i < results.length; i++) {
//     if (i > 0 && results[i].percentage < results[i - 1].percentage) {
//       rank = i + 1;
//     }
//     results[i].rank = rank;
//   }

//   //  Class Statistics
//   const totalStudents = results.length;
//   const passCount = results.filter((r) => r.status === "PASS").length;
//   const failCount = totalStudents - passCount;

//   const average =
//     totalStudents > 0
//       ? (
//           results.reduce((sum, r) => sum + r.percentage, 0) /
//           totalStudents
//         ).toFixed(2)
//       : 0;

//   const topper = results.length > 0 ? results[0] : null;

//   return {
//     examId,
//     totalStudents,
//     passCount,
//     failCount,
//     passPercentage:
//       totalStudents > 0
//         ? ((passCount / totalStudents) * 100).toFixed(2)
//         : 0,
//     average,
//     topper,
//     results,
//   };
// };


export const getExamResultsOverview = async (examId) => {
  if (!examId) throw new Error("Exam ID required");

  //  Check exam and status
  const exam = await client.exam.findUnique({
    where: { id: examId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!exam) throw new Error("Exam not found");

  if (exam.status !== "PUBLISHED") {
    throw new Error("Results not published yet");
  }

  //  Get exam subjects (for total marks + pass marks)
  const examSubjects = await client.examSubject.findMany({
    where: { examId },
    select: {
      id: true,
      totalMarks: true,
      passingMarks: true,
    },
  });

  const subjectIds = examSubjects.map((s) => s.id);

  const totalExamMarks = examSubjects.reduce(
    (sum, s) => sum + s.totalMarks,
    0
  );

  //  Aggregate marks per student in database
  const aggregated = await client.examResult.groupBy({
    by: ["studentId"],
    where: {
      examSubjectId: { in: subjectIds },
    },
    _sum: {
      obtainedMarks: true,
    },
  });

  if (!aggregated.length) {
    return {
      examId,
      totalStudents: 0,
      results: [],
    };
  }

  const studentIds = aggregated.map((a) => a.studentId);

  //  Fetch student info
  const students = await client.student.findMany({
    where: { id: { in: studentIds } },
    select: {
      id: true,
      studentName: true,
      rollNumber: true,
    },
  });

  const studentMap = new Map(
    students.map((s) => [s.id, s])
  );

  //  Detect failed subjects
  const failRecords = await client.examResult.findMany({
    where: {
      examSubjectId: { in: subjectIds },
      obtainedMarks: {
        not: null,
      },
    },
    include: {
      examSubject: {
        select: {
          passingMarks: true,
        },
      },
    },
  });

  const failMap = {};

  for (const r of failRecords) {
    if (r.obtainedMarks < r.examSubject.passingMarks) {
      failMap[r.studentId] = true;
    }
  }

  //  Build results
  let results = aggregated.map((row) => {
    const student = studentMap.get(row.studentId);

    const obtained = row._sum.obtainedMarks || 0;

    const percentage =
      totalExamMarks > 0
        ? (obtained / totalExamMarks) * 100
        : 0;

    const roundedPercentage = Number(
      percentage.toFixed(2)
    );

    const failed = failMap[row.studentId] || false;

    return {
      student,
      totalObtained: obtained,
      totalMarks: totalExamMarks,
      percentage: roundedPercentage,
      grade: calculateGrade(roundedPercentage),
      status: failed ? "FAIL" : "PASS",
    };
  });

  //  Sort by percentage
  results.sort((a, b) => b.percentage - a.percentage);

  //  Ranking (tie-safe)
  let rank = 1;
  for (let i = 0; i < results.length; i++) {
    if (i > 0 && results[i].percentage < results[i - 1].percentage) {
      rank = i + 1;
    }
    results[i].rank = rank;
  }

  //  Class statistics
  const totalStudents = results.length;
  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = totalStudents - passCount;

  const average =
    totalStudents > 0
      ? (
          results.reduce((sum, r) => sum + r.percentage, 0) /
          totalStudents
        ).toFixed(2)
      : 0;

  const topper = results.length > 0 ? results[0] : null;

  return {
    examId,
    totalStudents,
    passCount,
    failCount,
    passPercentage:
      totalStudents > 0
        ? ((passCount / totalStudents) * 100).toFixed(2)
        : 0,
    average,
    topper,
    results,
  };
};



export const getStudentDetailedResult = async (
  examId,
  studentId,
  role,
  userId
) => {
  if (!examId || !studentId) {
    throw new Error("Exam ID and Student ID required");
  }

  //  Student can only access their own result
  if (role === "student" && studentId !== userId) {
    throw new Error("Unauthorized access to result");
  }

  const exam = await client.exam.findUnique({
    where: { id: examId },
    include: {
      subjects: {
        include: {
          subject: true,
          results: {
            where: { studentId },
          },
        },
      },
    },
  });

  if (!exam) throw new Error("Exam not found");

  //  Only allow after publish
  if (exam.status !== "PUBLISHED") {
    throw new Error("Results not published yet");
  }

  let totalObtained = 0;
  let totalMarks = 0;
  let failed = false;

  const subjectResults = exam.subjects.map((subject) => {
    const result = subject.results[0];
    const obtained = result?.obtainedMarks || 0;

    totalObtained += obtained;
    totalMarks += subject.totalMarks;

    const passed = obtained >= subject.passingMarks;

    if (!passed) {
      failed = true;
    }

    return {
      subjectName: subject.subject.name,
      totalMarks: subject.totalMarks,
      passingMarks: subject.passingMarks,
      obtainedMarks: obtained,
      status: passed ? "PASS" : "FAIL",
    };
  });

  const percentage = totalMarks > 0 ? Number(((totalObtained / totalMarks) * 100).toFixed(2)) : 0;

  return {
    examId,
    examTitle: exam.title, // Added for frontend
    studentId,
    subjects: subjectResults,
    totalObtained,
    totalMarks,
    percentage,
    grade: calculateGrade(percentage),
    finalStatus: failed ? "FAIL" : "PASS",
  };
};


export const getStudentExamSummary = async (examId, studentId) => {
  if (!examId || !studentId) {
    throw new Error("Exam ID and Student ID required");
  }

  const examSubjects = await client.examSubject.findMany({
    where: { examId },
    include: {
      results: {
        where: { studentId },
      },
    },
  });

  if (!examSubjects.length) {
    throw new Error("Exam not found");
  }

  let totalObtained = 0;
  let totalMarks = 0;
  let failed = false;

  examSubjects.forEach((subject) => {
    totalMarks += subject.totalMarks;

    const result = subject.results[0];

    if (result?.obtainedMarks != null) {
      totalObtained += result.obtainedMarks;

      if (result.obtainedMarks < subject.passingMarks) {
        failed = true;
      }
    }
  });

  const percentage = totalMarks > 0 ? ((totalObtained / totalMarks) * 100).toFixed(2): 0;

  return {
    examId,
    studentId,
    totalObtained,
    totalMarks,
    percentage,
    status: failed ? "FAIL" : "PASS",
  };
};
