import type { LucideIcon } from "lucide-react";

export type ShellNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: number;
  keywords?: string[];
};

export type ShellNavSection = {
  label: string;
  items: ShellNavItem[];
};

export type ShellBrand = {
  title: string;
  subtitle: string;
  homeUrl: string;
  icon: LucideIcon;
  iconClassName: string;
};

export type ShellPageMatcher = {
  prefix: string;
  title: string;
};

export type ShellUser = {
  name?: string;
  email?: string;
  roleLabel: string;
  imageUrl?: string;
  initials?: string;
};

export type ShellCommandItem = {
  title: string;
  url: string;
  section?: string;
  keywords?: string[];
};
