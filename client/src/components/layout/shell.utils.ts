import type {
  ShellCommandItem,
  ShellNavSection,
  ShellPageMatcher,
} from "@/components/layout/shell.types";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

export const isRouteMatch = (pathname: string, url: string) => {
  const normalizedPath = normalizePath(pathname);
  const normalizedUrl = normalizePath(url);

  return (
    normalizedPath === normalizedUrl ||
    normalizedPath.startsWith(`${normalizedUrl}/`)
  );
};

export const resolvePageTitle = (
  pathname: string,
  sections: ShellNavSection[],
  extraTitles: ShellPageMatcher[] = [],
  fallbackTitle = "Overview",
) => {
  const normalizedPath = normalizePath(pathname);

  const extraMatch = [...extraTitles]
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((item) => normalizedPath.startsWith(normalizePath(item.prefix)));

  if (extraMatch) {
    return extraMatch.title;
  }

  const navMatch = sections
    .flatMap((section) => section.items)
    .sort((a, b) => b.url.length - a.url.length)
    .find((item) => isRouteMatch(normalizedPath, item.url));

  return navMatch?.title ?? fallbackTitle;
};

export const buildCommandItems = (
  sections: ShellNavSection[],
  extras: ShellCommandItem[] = [],
) => {
  const seen = new Set<string>();

  return [...sections.flatMap((section) =>
    section.items.map((item) => ({
      title: item.title,
      url: item.url,
      section: section.label,
      keywords: item.keywords,
    })),
  ), ...extras].filter((item) => {
    const key = `${item.title}:${item.url}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};
