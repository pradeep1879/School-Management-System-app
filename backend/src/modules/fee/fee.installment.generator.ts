import { client } from "../../prisma/db.ts";

const getLastDayOfMonth = (year, month) =>
  new Date(year, month, 0).getDate();

const getSafeDueDate = (year, month, day) => {
  const safeDay = Math.min(
    day,
    getLastDayOfMonth(year, month)
  );

  return new Date(year, month - 1, safeDay);
};

const getComponentDueDay = (component) =>
  component.dueDay ||
  (component.frequency === "MONTHLY" ? 10 : 20);

const getComponentDueMonth = (component) =>
  component.dueMonth ||
  (component.frequency === "QUARTERLY" ? 3 : 3);

const getQuarterMonths = (selectedMonth) =>
  Array.from({ length: 12 }, (_, index) => index + 1)
    .filter(
      (month) =>
        ((month - selectedMonth) % 3 + 3) % 3 === 0
    );

const getAcademicSessionStartYear = (session) => {
  const match = session?.match(/^(\d{4})/);

  return match ? Number(match[1]) : new Date().getFullYear();
};

export const generateInstallments = async (
  structureId
) => {
  //  Fetch exact structure
  console.log("genereateInstallments", structureId);
  const structure =
    await client.feeStructure.findUnique({
      where: { id: structureId },
      include: {
        components: true,
        class: true,
      },
    });

  if (!structure)
    throw new Error("Fee structure not found");

  if (!structure.components.length)
    throw new Error(
      "No fee components found for this structure"
    );

  //  Get students of that structure's class
  const students =
    await client.student.findMany({
      where: {
        classId: structure.classId,
      },
    });

  if (!students.length)
    throw new Error(
      "No students found for this class"
    );

  const currentYear = getAcademicSessionStartYear(
    structure.session
  );

  for (const student of students) {
    for (const component of structure.components) {
      const dueDay = getComponentDueDay(component);

      if (component.frequency === "MONTHLY") {
        for (let month = 1; month <= 12; month++) {
          const existing =
            await client.studentFeeInstallment.findFirst({
              where: {
                studentId: student.id,
                feeComponentId: component.id,
                month,
                year: currentYear,
              },
            });

          if (existing) continue;

          await client.studentFeeInstallment.create({
            data: {
              studentId: student.id,
              feeComponentId: component.id,
              month,
              year: currentYear,
              totalAmount: component.amount,
              dueDate: getSafeDueDate(
                currentYear,
                month,
                dueDay
              ),
            },
          });
        }
      }
      else if (component.frequency === "QUARTERLY") {
        const quarterlyMonths = getQuarterMonths(
          getComponentDueMonth(component)
        );

        for (const month of quarterlyMonths) {
          const existing =
            await client.studentFeeInstallment.findFirst({
              where: {
                studentId: student.id,
                feeComponentId: component.id,
                month,
                year: currentYear,
              },
            });

          if (existing) continue;

          await client.studentFeeInstallment.create({
            data: {
              studentId: student.id,
              feeComponentId: component.id,
              month,
              year: currentYear,
              totalAmount: component.amount,
              dueDate: getSafeDueDate(
                currentYear,
                month,
                dueDay
              ),
            },
          });
        }
      }
      else {
        const dueMonth = getComponentDueMonth(component);
        const existing =
          await client.studentFeeInstallment.findFirst({
            where: {
              studentId: student.id,
              feeComponentId: component.id,
              year: currentYear,
              month: null,
            },
          });

        if (existing) continue;

        await client.studentFeeInstallment.create({
          data: {
            studentId: student.id,
            feeComponentId: component.id,
            year: currentYear,
            totalAmount: component.amount,
            dueDate: getSafeDueDate(
              currentYear,
              dueMonth,
              dueDay
            ),
          },
        });
      }
    }
  }

  return {
    success: true,
    message: "Installments generated successfully",
  };
};
