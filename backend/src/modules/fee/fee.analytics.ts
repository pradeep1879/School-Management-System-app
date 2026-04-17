import { client } from "../../prisma/db.ts";


export const getFinanceDashboard = async () => {

  
  // overview
  const totalInstallments = await client.studentFeeInstallment.aggregate({
    _sum: { totalAmount: true },
  });

  const totalPaid = await client.studentFeeInstallment.aggregate({
    _sum: { paidAmount: true },
  });

  const today = new Date();
  today.setHours(0,0,0,0);

  const todayPayments = await client.payment.aggregate({
    where: {
      createdAt: { gte: today }
    },
    _sum: { amountPaid: true }
  });

  const overview = {
    totalRevenue: totalInstallments._sum.totalAmount || 0,
    collected: totalPaid._sum.paidAmount || 0,
    due:
      (totalInstallments._sum.totalAmount || 0) -
      (totalPaid._sum.paidAmount || 0),
    todayCollection: todayPayments._sum.amountPaid || 0
  };

  
  // class wise collection
  const classes = await client.class.findMany({
    include: {
      students: {
        include: {
          feeInstallments: true
        }
      }
    }
  });

  const classCollection = classes.map((cls) => {

    let total = 0;
    let paid = 0;

    cls.students.forEach((s)=>{
      s.feeInstallments.forEach((i)=>{
        total += i.totalAmount;
        paid += i.paidAmount;
      });
    });

    return {
      className: cls.slug,
      total,
      collected: paid,
      due: total - paid
    };

  });

  
  // monthly collection
  const payments = await client.payment.findMany({
    select: {
      amountPaid: true,
      createdAt: true
    }
  });

  const monthlyMap = {};

  payments.forEach((p)=>{

    const month = new Date(p.createdAt).toLocaleString("default",{month:"short"});

    if(!monthlyMap[month]) monthlyMap[month] = 0;

    monthlyMap[month] += p.amountPaid;

  });

  const monthlyTrend = Object.entries(monthlyMap).map(([month,amount])=>({
    month,
    amount
  }));

  
  // payment method
  const methods = await client.payment.groupBy({
    by:["paymentMethod"],
    _sum:{
      amountPaid:true
    }
  });

  const paymentMethods = methods.map((m)=>({
    method: m.paymentMethod,
    amount: m._sum.amountPaid
  }));

  
  // recent payments
  const recent = await client.payment.findMany({
    take:5,
    orderBy:{ createdAt:"desc" },
    include:{
      installment:{
        include:{
          student:true
        }
      }
    }
  });

  const recentPayments = recent.map((p)=>({
    id:p.id,
    student:p.installment.student.studentName,
    amount:p.amountPaid,
    method:p.paymentMethod,
    date:p.createdAt
  }));

  return {
    overview,
    classCollection,
    monthlyTrend,
    paymentMethods,
    recentPayments
  };

};