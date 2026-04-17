import { client } from "../../prisma/db.ts";

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

  const currentYear = new Date().getFullYear();

  for (const student of students) {
    for (const component of structure.components) {

      //  monthly
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
              dueDate: new Date(currentYear, month - 1, 10),
            },
          });
        }
      }

      //  yearly / monthly
      else {
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
            dueDate: new Date(currentYear, 2, 20),
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