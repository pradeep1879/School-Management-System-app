import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";

import type {
  ShellCommandItem,
  ShellNavSection,
  ShellPageMatcher,
  ShellUser,
} from "@/components/layout/shell.types";
import { resolvePageTitle } from "@/components/layout/shell.utils";
import { AppCommandPalette } from "@/components/layout/AppCommandPalette";
import { ModeToggle } from "@/components/extra-components/ModeToggle";
import { AnnouncementBell } from "@/features/announcements/components/AnnouncementBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

type AppShellNavbarProps = {
  sections: ShellNavSection[];
  extraTitles?: ShellPageMatcher[];
  commandItems: ShellCommandItem[];
  user?: ShellUser;
  loading?: boolean;
  profileHref: string;
  settingsHref: string;
  onLogout: () => void | Promise<void>;
};

export const AppShellNavbar = ({
  sections,
  extraTitles = [],
  commandItems,
  user,
  loading = false,
  profileHref,
  settingsHref,
  onLogout,
}: AppShellNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = useMemo(
    () => resolvePageTitle(location.pathname, sections, extraTitles),
    [extraTitles, location.pathname, sections],
  );

  return (
    <header className="sticky top-0 p-0.5 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/65">
      <div className="flex min-h-18 items-center gap-3 px-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <SidebarTrigger
            variant="ghost"
            className="h-11 w-11 rounded-2xl border bg-card shadow-sm md:hidden"
          />

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold tracking-tight text-foreground">
              {pageTitle}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              Workspace overview and quick actions
            </p>
          </div>
        </div>

        <div className="hidden flex-1 justify-center xl:flex">
          <AppCommandPalette items={commandItems} />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block xl:hidden">
            <AppCommandPalette items={commandItems} />
          </div>

          <div className="flex items-center gap-1 rounded-2xl border border-border/70 bg-card/75 p-1 shadow-sm">
            <AnnouncementBell />
            <ModeToggle />
          </div>

          {loading ? (
            <div className="hidden items-center gap-3 rounded-2xl border border-border/70 bg-card/75 px-3 py-2 shadow-sm sm:flex">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card/75 px-2 py-1.5 shadow-sm">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto rounded-2xl px-1.5 py-1.5 hover:bg-muted/60"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 border shadow-sm">
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback className="font-semibold">
                          {user?.initials ?? "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="hidden text-left sm:block">
                        <p className="max-w-37.5 truncate text-sm font-semibold text-foreground">
                          {user?.name ?? "User"}
                        </p>
                        <p className="max-w-37.5 truncate text-xs text-muted-foreground">
                          {user?.roleLabel}
                        </p>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-64 rounded-2xl">
                  <DropdownMenuLabel className="space-y-1">
                    <p className="font-medium text-foreground">{user?.name ?? "User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email ?? "No email"}</p>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {user?.roleLabel}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => navigate(profileHref)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(settingsHref)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
