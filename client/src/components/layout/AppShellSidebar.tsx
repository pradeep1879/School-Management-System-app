import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";

import type {
  ShellBrand,
  ShellNavItem,
  ShellNavSection,
} from "@/components/layout/shell.types";
import { isRouteMatch } from "@/components/layout/shell.utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

type AppShellSidebarProps = {
  brand: ShellBrand;
  sections: ShellNavSection[];
  onLogout?: () => void | Promise<void>;
};

export const AppShellSidebar = ({
  brand,
  sections,
  onLogout,
}: AppShellSidebarProps) => {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const BrandIcon = brand.icon;

  const renderItem = (item: ShellNavItem) => {
    const isActive = isRouteMatch(location.pathname, item.url);

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={item.title}
          className={cn(
            "h-11 rounded-2xl px-2.5 transition-all duration-200",
            isActive
              ? "bg-primary/10 text-primary shadow-sm"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          <Link
            to={item.disabled ? "#" : item.url}
            onClick={() => {
              if (!item.disabled) {
                setOpenMobile(false);
              }
            }}
            className={cn(
              "group/item relative flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0",
              item.disabled && "pointer-events-none opacity-50",
            )}
          >
            <span
              className={cn(
                "absolute -left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition-opacity group-data-[collapsible=icon]:hidden",
                isActive ? "bg-primary opacity-100" : "opacity-0",
              )}
            />

            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-colors",
                isActive
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-transparent bg-muted/40 text-muted-foreground group-hover/item:bg-muted group-hover/item:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
            </div>

            <span className="truncate font-medium group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>

            {typeof item.badge === "number" && item.badge > 0 ? (
              <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary group-data-[collapsible=icon]:hidden">
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            ) : null}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/70 bg-sidebar/95">
      <SidebarHeader className="border-b border-border/60 py-3">
        <div className="flex items-center justify-between gap-2 px-2 group-data-[collapsible=icon]:justify-center">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-auto rounded-2xl p-0 hover:bg-transparent">
                <Link
                  to={brand.homeUrl}
                  className="group flex items-center gap-3 rounded-2xl px-1 py-1 transition-colors hover:bg-muted/40 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ring-1 ring-white/10",
                      brand.iconClassName,
                    )}
                  >
                    <BrandIcon className="h-5 w-5 text-white" />
                  </div>

                  <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-base font-semibold tracking-tight">
                      {brand.title}
                    </p>
                    <p className="truncate text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {brand.subtitle}
                    </p>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarTrigger
            variant="ghost"
            className="hidden h-10 w-10 rounded-2xl border border-border/70 bg-card/70 shadow-sm transition-colors hover:bg-card"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-6 px-2 py-4">
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/90">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{section.items.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {onLogout ? (
        <>
          <SidebarSeparator />
          <SidebarFooter className="p-2">
            <Button
              type="button"
              variant="outline"
              onClick={onLogout}
              className="h-11 w-full justify-start rounded-2xl border-border/70 bg-card/70 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            >
              <LogOut className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </Button>
          </SidebarFooter>
        </>
      ) : null}

      <SidebarRail />
    </Sidebar>
  );
};
