import { useAuthStore } from "@/store/auth.store"
import type React from "react"
import { Navigate, useLocation } from "react-router-dom"



const PublicRoute = ({ children }: { children: React.ReactNode}) => {

  const { token, role, hasHydrated } = useAuthStore()
  const location = useLocation()

  if (!hasHydrated) return null

  if (token && role) {

    const roleDashboard = {
      admin: "/admin/dashboard",
      teacher: "/teacher/dashboard",
      student: "/student/dashboard"
    }

    const currentPath = location.pathname

    // If user is already logged in and visiting their own login page
    if (
      (role === "admin" && currentPath === "/") ||
      (role === "teacher" && currentPath === "/teacher/login") ||
      (role === "student" && currentPath === "/student/login")
    ) {
      return <Navigate to={roleDashboard[role]} replace />
    }

  }

  return <>{children}</>
}

export default PublicRoute