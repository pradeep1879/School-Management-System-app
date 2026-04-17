import { useAuthStore } from "@/store/auth.store"
import { Navigate, useLocation } from "react-router-dom"

interface Props {
  children: React.ReactNode
  allowedRoles: ("admin" | "teacher" | "student")[]
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {

  const { token, role, hasHydrated } = useAuthStore()
  const location = useLocation()

  if (!hasHydrated) {
    return null
  }

  // Not logged in
  if (!token || !role) {

    if (location.pathname.startsWith("/teacher")) {
      return <Navigate to="/teacher/login" replace />
    }

    if (location.pathname.startsWith("/student")) {
      return <Navigate to="/student/login" replace />
    }

    return <Navigate to="/" replace />
  }

  // Role not allowed
  if (!allowedRoles.includes(role)) {

    if (role === "admin") return <Navigate to="/admin/dashboard" replace />
    if (role === "teacher") return <Navigate to="/teacher/dashboard" replace />
    if (role === "student") return <Navigate to="/student/dashboard" replace />

  }

  return <>{children}</>
}

export default ProtectedRoute