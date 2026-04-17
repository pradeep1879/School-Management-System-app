// @ts-nocheck
import { client } from "../../prisma/db.ts";


// generate payroll
export const generateMonthlyPayroll = async (body, adminId) => {
  const { month, year } = body;

  if (!month || !year) {
    throw new Error("Month and year are required");
  }

  const existingPayroll = await client.teacherSalary.findFirst({
    where: { month, year },
  });

  if (existingPayroll) {
    throw new Error("Payroll already generated for this month");
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const attendanceSummary = await client.teacherAttendance.groupBy({
    by: ["teacherId", "status"],
    where: {
      date: { gte: startDate, lt: endDate },
      approvalStatus: "APPROVED",
    },
    _count: { status: true },
  });

  const teacherStats = {};

  for (const row of attendanceSummary) {
    const teacherId = row.teacherId;

    if (!teacherStats[teacherId]) {
      teacherStats[teacherId] = {
        presentDays: 0,
        absentDays: 0,
        leaveDays: 0,
        halfDays: 0,
      };
    }

    if (row.status === "PRESENT")
      teacherStats[teacherId].presentDays = row._count.status;

    if (row.status === "ABSENT")
      teacherStats[teacherId].absentDays = row._count.status;

    if (row.status === "LEAVE")
      teacherStats[teacherId].leaveDays = row._count.status;

    if (row.status === "HALF_DAY")
      teacherStats[teacherId].halfDays = row._count.status;
  }

  const teachers = await client.teacher.findMany({
    where: { id: { in: Object.keys(teacherStats) } },
    include: {
      salaryStructures: {
        take: 1,
        orderBy: { effectiveFrom: "desc" },
      },
    },
  });

  const salaryData = [];

  for (const teacher of teachers) {
    const structure = teacher.salaryStructures[0];

    if (!structure) {
      throw new Error(`Salary structure missing for teacher ${teacher.teacherName}`);
    }

    const stats = teacherStats[teacher.id];

    const deduction = stats.absentDays * structure.perDaySalary;

    const finalSalary = structure.baseSalary - deduction;

    salaryData.push({
      teacherId: teacher.id,
      generatedBy: adminId,
      month,
      year,
      presentDays: stats.presentDays,
      absentDays: stats.absentDays,
      leaveDays: stats.leaveDays,
      halfDays: stats.halfDays,
      baseSalary: structure.baseSalary,
      deduction,
      finalSalary,
    });
  }

  await client.teacherSalary.createMany({
    data: salaryData,
  });

  return {
    message: "Payroll generated successfully",
    count: salaryData.length,
  };
};



export const getAllTeacherSalaries = async () => {
   console.log("Salary route hit");
  return client.teacherSalary.findMany({
    include: {
      teacher: {
        select: {
          id: true,
          teacherName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const payTeacherSalary = async (salaryId, body) => {
  const { amount, method, referenceNo } = body;

  const payment = await client.salaryPayment.create({
    data: {
      salaryId,
      amount: Number(amount),
      paymentDate: new Date(),
      method,
      referenceNo,
    },
  });

  await client.teacherSalary.update({
    where: { id: salaryId },
    data: {
      status: "PAID",
    },
  });

  return {
    message: "Salary paid successfully",
    payment,
  };
};


export const getMySalaryHistory = async (teacherId) => {
  return client.teacherSalary.findMany({
    where: {
      teacherId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
