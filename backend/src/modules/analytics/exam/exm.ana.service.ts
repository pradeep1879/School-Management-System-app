// @ts-nocheck
import { client } from "../../../prisma/db.ts";

export const getExamAnalytics = async (examId) => {
   if (!examId) {
    throw new Error("Exam ID required");
  }

  const exam = await client.exam.findUnique({
    where: { id: examId },
    include: {
      subjects: {
        include: {
          subject: true,
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
          },
        },
      },
    },
  });

  if (!exam) throw new Error("Exam not found");

  const studentMap = {};
  const subjectAnalytics = {};
  const gradeDistribution = {
    "A+": 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0,
  };

  exam.subjects.forEach((subject) => {
    subjectAnalytics[subject.subject.name] = {
      total: 0,
      count: 0,
    };

    subject.results.forEach((result) => {
      const studentId = result.studentId;

      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          student: result.student,
          totalObtained: 0,
          totalMarks: 0,
          failed: false,
        };
      }

      const obtained = result.obtainedMarks || 0;

      studentMap[studentId].totalObtained += obtained;
      studentMap[studentId].totalMarks += subject.totalMarks;

      if (obtained < subject.passingMarks) {
        studentMap[studentId].failed = true;
      }

      subjectAnalytics[subject.subject.name].total += obtained;
      subjectAnalytics[subject.subject.name].count += 1;
    });
  });

  const students = Object.values(studentMap);

  const results = students.map((s) => {
    const percentage =
      (s.totalObtained / s.totalMarks) * 100;

    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";

    gradeDistribution[grade]++;

    return {
      name: s.student.studentName,
      percentage,
      failed: s.failed,
    };
  });

  results.sort((a, b) => b.percentage - a.percentage);

  const passCount = results.filter((r) => !r.failed).length;
  const failCount = results.length - passCount;

  const subjectPerformance = Object.entries(subjectAnalytics).map(
    ([subject, data]) => ({
      subject,
      average:
        data.count > 0
          ? Number((data.total / data.count).toFixed(2))
          : 0,
    })
  );

  return {
    overview: {
      totalStudents: results.length,
      passCount,
      failCount,
      average:
        results.reduce((sum, r) => sum + r.percentage, 0) /
        results.length,
      topper: results[0],
    },

    gradeDistribution: Object.entries(gradeDistribution).map(
      ([grade, count]) => ({
        grade,
        count,
      })
    ),

    subjectPerformance,

    topStudents: results.slice(0, 5),
  };
};
