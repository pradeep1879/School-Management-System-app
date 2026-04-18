import { client } from "../../prisma/db.ts";
import { generateInstallments } from "./fee.installment.generator.ts";
import { calculateLateFee } from "./fee.utils.ts";
import { normalizeAcademicSession } from "../../utils/session.ts";

const getInstallmentPayableTotal = (installment) => {
  const structure = installment.feeComponent?.feeStructure;
  const baseAmount = Math.max(
    0,
    (installment.feeComponent?.amount ??
      installment.totalAmount) -
      (installment.discountAmount || 0)
  );
  const lateFee = structure
    ? calculateLateFee(installment, structure)
    : 0;

  return {
    baseAmount,
    lateFee,
    payableTotal: baseAmount + lateFee,
  };
};

const getInstallmentStatus = (
  installment,
  payableTotal,
  paidAmount
) => {
  if (paidAmount >= payableTotal) {
    return "PAID";
  }

  const today = new Date();
  const isOverdue = today > installment.dueDate;

  if (paidAmount > 0) {
    return isOverdue ? "OVERDUE" : "PARTIAL";
  }

  return isOverdue ? "OVERDUE" : "PENDING";
};


export const createFeeStructure = async (
  body,
  role,
  adminId
) => {
  const {
    classId,
    lateFeeType,
    lateFeeAmount,
  } = body;
  const session = normalizeAcademicSession(body.session);

  if(role !== "admin"){
    throw new Error("Unauthorized")
  }
  const classRecord = await client.class.findFirst({
    where: {
      id: classId,
      adminId,
    },
    select: {
      id: true,
      session: true,
    },
  });

  if (!classRecord) {
    throw new Error("Invalid class");
  }

  if (session !== classRecord.session) {
    throw new Error(
      `Fee structure session must match the class session (${classRecord.session})`
    );
  }

  const effectiveSession = classRecord.session;

  const existingStructure =
    await client.feeStructure.findUnique({
      where: {
        classId_session: {
          classId,
          session: effectiveSession,
        },
      },
    });

  const structure = await client.feeStructure.upsert({
    where: {
      classId_session: {
        classId,
        session: effectiveSession,
      },
    },
    update: {
      lateFeeType,
      lateFeeAmount,
    },
    create: {
      classId,
      session: effectiveSession,
      lateFeeType,
      lateFeeAmount,
    },
  });

  return {
    message: existingStructure
      ? "Existing fee structure opened for this class and session"
      : "Fee structure created",
    reusedExisting: Boolean(existingStructure),
    structure,
  };
};

export const addFeeComponent = async (body, adminId) => {
  const {
    feeStructureId,
    name,
    amount,
    frequency,
    dueDay,
    dueMonth,
    isOptional,
  } = body;

  const feeStructure =
    await client.feeStructure.findFirst({
      where: {
        id: feeStructureId,
        class: {
          adminId,
        },
      },
      select: {
        id: true,
      },
    });

  if (!feeStructure) {
    throw new Error("Fee structure not found");
  }

  const component =
    await client.feeComponent.create({
      data: {
        feeStructureId,
        name,
        amount: Number(amount),
        frequency,
        dueDay: Number(dueDay),
        dueMonth:
          dueMonth === undefined || dueMonth === null
            ? null
            : Number(dueMonth),
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
  structureId,
  adminId
) => {
  const feeStructure =
    await client.feeStructure.findFirst({
      where: {
        id: structureId,
        class: {
          adminId,
        },
      },
      select: {
        id: true,
      },
    });

  if (!feeStructure) {
    throw new Error("Fee structure not found");
  }

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

  const { baseAmount, lateFee, payableTotal } =
    getInstallmentPayableTotal(installment);

  if (installment.paidAmount >= payableTotal) {
    throw new Error("This installment is already paid");
  }

  const dueAmount =
    payableTotal - installment.paidAmount;

  //  Prevent Overpayment
  if (amountPaid > dueAmount) {
    throw new Error(
      `Payment exceeds due amount. Remaining due is ₹${dueAmount}`
    );
  }

  const newPaidAmount = installment.paidAmount + amountPaid;

  const status = getInstallmentStatus(
    installment,
    payableTotal,
    newPaidAmount
  );

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
        totalAmount: baseAmount,
        paidAmount: newPaidAmount,
        status,
      },
    }),
  ]);

  return {
    message: "Payment collected successfully",
    lateFeeApplied: lateFee,
    remainingDue: payableTotal - newPaidAmount,
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
      feeComponent: {
        include: {
          feeStructure: true,
        },
      },
      payments: true,
    },
    orderBy: { dueDate: "asc" },
  });

  let total = 0;
  let paid = 0;

  installments.forEach((i) => {
    const { payableTotal } =
      getInstallmentPayableTotal(i);

    total += payableTotal;
    paid += i.paidAmount;
  });

  return {
    summary: {
      totalAmount: total,
      paidAmount: paid,
      dueAmount: Math.max(0, total - paid),
    },

    installments: installments.map((i) => {
      const { payableTotal } =
        getInstallmentPayableTotal(i);

      return {
        id: i.id,
        title: i.feeComponent.name,
        amount: payableTotal,
        dueAmount: Math.max(
          0,
          payableTotal - i.paidAmount
        ),
        dueDate: i.dueDate,
        status: getInstallmentStatus(
          i,
          payableTotal,
          i.paidAmount
        ),
      };
    }),

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
      feeInstallments: {
        include: {
          feeComponent: {
            include: {
              feeStructure: true,
            },
          },
        },
      },
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
      const { payableTotal } =
        getInstallmentPayableTotal(inst);
      const status = getInstallmentStatus(
        inst,
        payableTotal,
        inst.paidAmount
      );

      totalAmount += payableTotal;
      totalPaid += inst.paidAmount;

      studentTotal += payableTotal;
      studentPaid += inst.paidAmount;

      if (status === "OVERDUE") {
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
  const installments = await client.studentFeeInstallment.findMany({
    include: {
      feeComponent: {
        include: {
          feeStructure: true,
        },
      },
      student: {
        include: {
          class: true,
        },
      },
    },
  });

  let totalRevenue = 0;
  let totalCollected = 0;
  let overdueCount = 0;

  installments.forEach((installment) => {
    const { payableTotal } =
      getInstallmentPayableTotal(installment);
    const status = getInstallmentStatus(
      installment,
      payableTotal,
      installment.paidAmount
    );

    totalRevenue += payableTotal;
    totalCollected += installment.paidAmount;

    if (status === "OVERDUE") {
      overdueCount++;
    }
  });

  const totalStudents = await client.student.count();

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
          feeInstallments: {
            include: {
              feeComponent: {
                include: {
                  feeStructure: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const classSummaries = classes.map((cls) => {
    let total = 0;
    let paid = 0;

    cls.students.forEach((s) => {
      s.feeInstallments.forEach((i) => {
        const { payableTotal } =
          getInstallmentPayableTotal(i);

        total += payableTotal;
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
  const overdueMap = new Map();

  installments.forEach((inst) => {
    const { payableTotal } =
      getInstallmentPayableTotal(inst);
    const status = getInstallmentStatus(
      inst,
      payableTotal,
      inst.paidAmount
    );

    if (status !== "OVERDUE") {
      return;
    }

    const key = inst.student.id;

    if (!overdueMap.has(key)) {
      overdueMap.set(key, {
        id: inst.student.id,
        studentName: inst.student.studentName,
        className: inst.student.class.slug,
        dueAmount: 0,
      });
    }

    overdueMap.get(key).dueAmount += Math.max(
      0,
      payableTotal - inst.paidAmount
    );
  });

  return {
    totalRevenue,
    totalCollected,
    totalDue: Math.max(0, totalRevenue - totalCollected),
      
    todayCollection: todayPayments._sum.amountPaid || 0,
    totalStudents,
    overdueStudents: overdueCount,
    classes: classSummaries,
    recentPayments: formattedRecentPayments,
    overdueList: Array.from(overdueMap.values()),
  };
};
