import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";

import { RoleSwitcher } from "@/components/auth/RoleSwitcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Role } from "@/store/auth.store";

type LoginFormValues = {
  email?: string;
  userName?: string;
  password: string;
};

type LoginCardProps = {
  role: Exclude<Role, null>;
  title: string;
  description: string;
  identifierKey: "email" | "userName";
  identifierLabel: string;
  identifierPlaceholder: string;
  identifierType?: "email" | "text";
  submitLabel: string;
  isLoading?: boolean;
  serverError?: string | null;
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
};

const roleTheme = {
  admin: {
    kicker: "Administration access",
    heading: "School operations, approvals, and oversight in one place.",
    icon: ShieldCheck,
    panelClassName:
      "from-sky-600/25 via-primary/20 to-fuchsia-500/20",
    glowClassName: "bg-sky-500/10 text-sky-200",
  },
  teacher: {
    kicker: "Teacher workspace",
    heading: "Manage classes, attendance, and student progress effortlessly.",
    icon: UserRoundCog,
    panelClassName:
      "from-emerald-500/20 via-cyan-500/15 to-primary/20",
    glowClassName: "bg-emerald-500/10 text-emerald-100",
  },
  student: {
    kicker: "Student portal",
    heading: "Stay on top of classes, homework, exams, and AI practice.",
    icon: GraduationCap,
    panelClassName:
      "from-fuchsia-500/20 via-violet-500/20 to-primary/20",
    glowClassName: "bg-fuchsia-500/10 text-fuchsia-100",
  },
} as const;

export const LoginCard = ({
  role,
  title,
  description,
  identifierKey,
  identifierLabel,
  identifierPlaceholder,
  identifierType = "email",
  submitLabel,
  isLoading = false,
  serverError,
  onSubmit,
}: LoginCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = roleTheme[role];
  const RoleIcon = theme.icon;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_35%),linear-gradient(180deg,#060816_0%,#090d1f_100%)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div
          className={cn(
            "relative hidden overflow-hidden border-r border-white/10 bg-linear-to-br p-10 lg:flex",
            theme.panelClassName,
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_22%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_20%)]" />
          <div className="relative z-10 flex max-w-xl flex-col justify-between">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white shadow-lg">
                  <RoleIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">School ERP</p>
                  <p className="text-xs text-slate-300">Unified campus workspace</p>
                </div>
              </div>

              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
                  {theme.kicker}
                </p>
                <h1 className="max-w-lg text-4xl font-semibold leading-tight text-white">
                  Modern school management for every role.
                </h1>
                <p className="max-w-lg text-base leading-7 text-slate-300">
                  {theme.heading}
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/35 p-6 backdrop-blur">
              <div className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium", theme.glowClassName)}>
                Trusted by modern school teams
              </div>
              <p className="text-sm leading-6 text-slate-200">
                One secure workspace for operations, teaching, and student access,
                designed to stay fast and reliable throughout the school day.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-3 text-center lg:hidden">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-lg">
                <RoleIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-md font-semibold uppercase  text-muted-foreground">
                  School ERP
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-foreground">
                  Unified Login
                </h1>
              </div>
            </div>

            <Card className="overflow-hidden rounded-[28px] border-white/10 bg-slate-950/75 shadow-2xl backdrop-blur">
              <CardHeader className="space-y-5 border-b border-white/10 bg-slate-950/65 p-6 sm:p-8">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase  text-muted-foreground">
                    Choose your role
                  </p>
                  <RoleSwitcher role={role} />
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-2xl font-semibold text-white">
                    {title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-6 text-slate-400">
                    {description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 md:p-6 sm:p-8">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">
                      {identifierLabel}
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        type={identifierType}
                        placeholder={identifierPlaceholder}
                        className="h-12 rounded-2xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-primary/60"
                        {...register(identifierKey, {
                          required: `${identifierLabel} is required`,
                        })}
                      />
                    </div>
                    {errors[identifierKey] ? (
                      <p className="text-sm text-red-400">
                        {errors[identifierKey]?.message as string}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-200">
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-xs font-medium text-slate-400 transition-colors hover:text-white"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-12 rounded-2xl border-white/10 bg-white/5 pl-10 pr-11 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-primary/60"
                        {...register("password", {
                          required: "Password is required",
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password ? (
                      <p className="text-sm text-red-400">
                        {errors.password.message}
                      </p>
                    ) : null}
                  </div>

                  {serverError ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {serverError}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-2xl bg-linear-to-r from-primary via-primary to-violet-500 text-sm font-semibold text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-[1.01] hover:opacity-95 disabled:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      submitLabel
                    )}
                  </Button>
                </form>

                <div className="rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-center text-sm text-slate-400">
                  Secure role-based access for staff and students.
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-slate-500">
              © 2026 School ERP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
