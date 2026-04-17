import { useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, ShieldCheck, UserRoundCog } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Role } from "@/store/auth.store";

type RoleSwitcherProps = {
  role: Exclude<Role, null>;
};

const roleConfig = {
  admin: {
    label: "Admin",
    route: "/admin/login",
    icon: ShieldCheck,
  },
  teacher: {
    label: "Teacher",
    route: "/teacher/login",
    icon: UserRoundCog,
  },
  student: {
    label: "Student",
    route: "/student/login",
    icon: GraduationCap,
  },
} as const;

export const RoleSwitcher = ({ role }: RoleSwitcherProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border bg-muted/40 p-1">
      {(Object.keys(roleConfig) as Array<Exclude<Role, null>>).map((key) => {
        const item = roleConfig[key];
        const Icon = item.icon;
        const isActive = role === key || location.pathname === item.route;

        return (
          <Button
            key={key}
            type="button"
            variant="ghost"
            onClick={() => navigate(item.route)}
            className={cn(
              "h-11 rounded-xl border border-transparent text-sm font-medium transition-all duration-200 hover:scale-[1.01] hover:bg-background/80",
              isActive &&
                "bg-linear-to-r from-primary to-primary/80 text-primary-foreground shadow-md hover:bg-linear-to-r hover:from-primary hover:to-primary/80",
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </div>
  );
};
