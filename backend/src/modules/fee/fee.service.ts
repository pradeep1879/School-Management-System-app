import { client } from "../../prisma/db.ts";
import { generateInstallments } from "./fee.installment.generator.ts";
import { calculateLateFee } from "./fee.utils.ts";


// create structure, this is only for admin
export const createFeeStructure = async (body, role) => {
  const { classId, session, lateFeeType, lateFeeAmount } = body;

  if(role !== "admin"){
    throw new Error("Unauthorized")
  }
  const structure = await client.feeStructure.create({
    data: {
      classId,
      session,
      lateFeeType,
      lateFeeAmount,
    },
  });

  return {
    message: "Fee structure created",
    structure,
  };
};

// add component , this also for admin
export const addFeeComponent = async (body) => {
  const {
    feeStructureId,
    name,
    amount,
    frequency,
    isOptional,
  } = body;

  const component =
    await client.feeComponent.create({
      data: {
        feeStructureId,
        name,
        amount,
        frequency,
        isOptional,
      },
    });

  return {
    message: "Component added successfully",
    component,
  };
};


// generate installments, admin
export const generateInstallmentsForStructure = async (
  structureId
) => {
  return await generateInstallments(structureId);
};


// collect payment per student
export const collectPayment = async (body, adminId) => {
  const { installmentId, amountPaid, paymentMethod } = body;

  if (amountPaid <= 0) {
    throw new Error("Invalid payment amount");
  }

  const installment = await client.studentFeeInstallment.findUnique({
    where: { id: installmentId },
    include: {
      feeComponent: {
        include: {
          feeStructure: true,
        },
      },
    },
  });

  if (!installment) {
    throw new Error("Installment not found");
  }

   if (installment.status === "PAID") {
    throw new Error("This installment is already paid");
  }

  const structure = installment.feeComponent.feeStructure;

  // Calculate Late Fee
  const lateFee = calculateLateFee(installment, structure);

  const updatedTotal = installment.totalAmount + lateFee;

  const dueAmount = updatedTotal - installment.paidAmount;

  //  Prevent Overpayment
  if (amountPaid > dueAmount) {
    throw new Error(
      `Payment exceeds due amount. Remaining due is ₹${dueAmount}`
    );
  }

  const newPaidAmount = installment.paidAmount + amountPaid;

  const status = newPaidAmount >= updatedTotal ? "PAID" : "PARTIAL";

  await client.$transaction([
    client.payment.create({
      data: {
        installmentId,
        receiptNumber: `RCPT-${Date.now()}`,
        amountPaid: Number(amountPaid),
        paymentMethod: paymentMethod || "CASH",
        collectedBy: adminId,
      },
    }),

    client.studentFeeInstallment.update({
      where: { id: installmentId },
      data: {
        paidAmount: newPaidAmount,
        totalAmount: updatedTotal,
        status,
      },
    }),
  ]);

  return {
    message: "Payment collected successfully",
    lateFeeApplied: lateFee,
    remainingDue: updatedTotal - newPaidAmount,
  };
};


// student fee summary
export const getStudentFeeSummary = async (studentId) => {

  const isStudentExist = await client.student.findFirst({
    where:{
      id: studentId
    }
  })
  if(!isStudentExist){
    throw new Error("Student does not exist")
  }

  const installments = await client.studentFeeInstallment.findMany({
    where: { studentId },
    include: {
      feeComponent: true,
      payments: true,
    },
    orderBy: { dueDate: "asc" },
  });

  let total = 0;
  let paid = 0;

  installments.forEach((i) => {
    total += i.totalAmount;
    paid += i.paidAmount;
  });

  return {
    summary: {
      totalAmount: total,
      paidAmount: paid,
      dueAmount: total - paid,
    },

    installments: installments.map((i) => ({
      id: i.id,
      title: i.feeComponent.name,
      amount: i.totalAmount,
      dueAmount: i.totalAmount - i.paidAmount,
      dueDate: i.dueDate,
      status: i.status,
    })),

    payments: installments.flatMap((i) =>
      i.payments.map((p) => ({
        id: p.id,
        receiptNo: p.receiptNumber,
        amount: p.amountPaid,
        paymentDate: p.createdAt,
        method: p.paymentMethod,
      }))
    ),
  };
};


// fee summary for class
export const getClassFeeSummary = async (classId) => {
  const students = await client.student.findMany({
    where: { classId },
    include: {
      feeInstallments: true,
    },
  });

  let totalAmount = 0;
  let totalPaid = 0;
  let paidStudents = 0;
  let overdueStudents = 0;

  students.forEach((student) => {
    let studentPaid = 0;
    let studentTotal = 0;
    let hasOverdue = false;

    student.feeInstallments.forEach((inst) => {
      totalAmount += inst.totalAmount;
      totalPaid += inst.paidAmount;

      studentTotal += inst.totalAmount;
      studentPaid += inst.paidAmount;

      if (inst.status === "OVERDUE") {
        hasOverdue = true;
      }
    });

    if (studentPaid >= studentTotal && studentTotal > 0) {
      paidStudents++;
    }

    if (hasOverdue) {
      overdueStudents++;
    }
  });

  // Today collection
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayPayments = await client.payment.aggregate({
    where: {
      installment: {
        student: {
          classId,
        },
      },
      createdAt: {
        gte: today,
      },
    },
    _sum: {
      amountPaid: true,
    },
  });

  return {
    totalAmount,
    totalPaid,
    totalDue: totalAmount - totalPaid,
    todayCollection: todayPayments._sum.amountPaid || 0,
    paidStudents,
    overdueStudents,
  };
};

// this is for admin finance dashboard
export const getAdminFinanceSummary = async () => {
  const totalInstallments = await client.studentFeeInstallment.aggregate({
    _sum: { totalAmount: true },
  });

  const totalPaid = await client.studentFeeInstallment.aggregate({
    _sum: { paidAmount: true },
  });

  const totalStudents = await client.student.count();

  const overdueCount = await client.studentFeeInstallment.count({
    where: { status: "OVERDUE" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayPayments = await client.payment.aggregate({
    where: {
      createdAt: { gte: today },
    },
    _sum: { amountPaid: true },
  });

  // Class-wise collection
  const classes = await client.class.findMany({
    include: {
      students: {
        include: {
          feeInstallments: true,
        },
      },
    },
  });

  const classSummaries = classes.map((cls) => {
    let total = 0;
    let paid = 0;

    cls.students.forEach((s) => {
      s.feeInstallments.forEach((i) => {
        total += i.totalAmount;
        paid += i.paidAmount;
      });
    });

    return {
      id: cls.id,
      className: cls.slug,
      total,
      paid,
      due: total - paid,
    };
  });

  // Recent Payments
  const recentPayments = await client.payment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      installment: {
        include: {
          student: true,
        },
      },
    },
  });

  const formattedRecentPayments = recentPayments.map((p) => ({
    id: p.id,
    studentName: p.installment.student.studentName,
    amount: p.amountPaid,
    paymentDate: p.createdAt,
    method: p.paymentMethod,
  }));

  // Overdue Students List
  const overdueInstallments = await client.studentFeeInstallment.findMany({
    where: { status: "OVERDUE" },
    include: {
      student: {
        include: { class: true },
      },
    },
  });

  const overdueMap = new Map();

  overdueInstallments.forEach((inst) => {
    const key = inst.student.id;

    if (!overdueMap.has(key)) {
      overdueMap.set(key, {
        id: inst.student.id,
        studentName: inst.student.studentName,
        className: inst.student.class.slug,
        dueAmount: 0,
      });
    }

    overdueMap.get(key).dueAmount += inst.totalAmount - inst.paidAmount;
  });

  return {
    totalRevenue: totalInstallments._sum.totalAmount || 0,
    totalCollected: totalPaid._sum.paidAmount || 0,
    totalDue:
      (totalInstallments._sum.totalAmount || 0) - (totalPaid._sum.paidAmount || 0),
      
    todayCollection: todayPayments._sum.amountPaid || 0,
    totalStudents,
    overdueStudents: overdueCount,
    classes: classSummaries,
    recentPayments: formattedRecentPayments,
    overdueList: Array.from(overdueMap.values()),
  };
};