export const normalizeSessionInput = (
  rawSession: string
) => {
  const value = rawSession.trim();
  const match = value.match(
    /^(\d{4})\s*[-/]\s*(\d{2}|\d{4})$/
  );

  if (!match) {
    return value;
  }

  const startYear = Number(match[1]);
  const endToken = match[2];
  const endYear =
    endToken.length === 2
      ? Number(`${String(startYear).slice(0, 2)}${endToken}`)
      : Number(endToken);

  if (endYear !== startYear + 1) {
    return value;
  }

  return `${startYear}-${endYear}`;
};
