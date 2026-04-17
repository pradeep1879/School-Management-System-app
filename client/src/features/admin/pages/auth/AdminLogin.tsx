import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginCard } from "@/components/auth/LoginCard";
import { useAuthStore } from "@/store/auth.store";
import { adminLogin } from "../../api/admin.api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <LoginCard
      role="admin"
      title="Admin Login"
      description="Sign in to manage students, teachers, approvals, classes, and school operations."
      identifierKey="email"
      identifierLabel="Email"
      identifierPlaceholder="admin@schoolerp.com"
      identifierType="email"
      submitLabel="Login as Admin"
      isLoading={loading}
      serverError={serverError}
      onSubmit={async (values) => {
        try {
          setLoading(true);
          setServerError(null);

          const res = await adminLogin({
            email: values.email ?? "",
            password: values.password,
          });

          const { token, admin } = res.data;

          setAuth({
            token,
            role: "admin",
            userId: admin.id,
          });

          navigate("/admin/dashboard");
        } catch (error: any) {
          setServerError(
            error?.response?.data?.message || "Invalid email or password",
          );
        } finally {
          setLoading(false);
        }
      }}
    />
  );
}
