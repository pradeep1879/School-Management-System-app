export const formatClassLabel = (classItem?: {
  slug?: string;
  section?: string;
  session?: string;
}) => {
  if (!classItem) {
    return "";
  }

  return `Class ${classItem.slug} - Section ${classItem.section} - Session ${classItem.session}`;
};

export const formatCompactClassLabel = (classItem?: {
  slug?: string;
  section?: string;
  session?: string;
}) => {
  if (!classItem) {
    return "";
  }

  return `${classItem.slug} - ${classItem.section} - ${classItem.session}`;
};
