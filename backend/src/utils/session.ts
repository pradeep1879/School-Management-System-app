export const normalizeAcademicSession = (
  rawSession
) => {
  const value = String(rawSession || "").trim();

  const match = value.match(
    /^(\d{4})\s*[-/]\s*(\d{2}|\d{4})$/
  );

  if (!match) {
    throw new Error(
      "Session must be in the format YYYY-YYYY or YYYY-YY"
    );
  }

  const startYear = Number(match[1]);
  const endToken = match[2];
  const endYear =
    endToken.length === 2
      ? Number(`${String(startYear).slice(0, 2)}${endToken}`)
      : Number(endToken);

  if (endYear !== startYear + 1) {
    throw new Error(
      "Session must cover consecutive academic years"
    );
  }

  return `${startYear}-${endYear}`;
};
