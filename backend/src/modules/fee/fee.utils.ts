// @ts-nocheck
export const calculateLateFee = (
  installment,
  structure
) => {
  if (structure.lateFeeType === "NONE")
    return 0;

  const today = new Date();
  if (today <= installment.dueDate) return 0;

  const daysLate =  Math.floor((today - installment.dueDate) / (1000 * 60 * 60 * 24));

  if (structure.lateFeeType === "FIXED")
    return structure.lateFeeAmount;

  if (structure.lateFeeType === "DAILY")
    return daysLate * structure.lateFeeAmount;

  return 0;
};
