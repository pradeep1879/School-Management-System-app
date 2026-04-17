
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Role = "admin" | "teacher" | "student" | null

interface AuthState {
  token?: string | null
  role: Role
  userId: string | null
  hasHydrated: boolean

  setAuth: (data: {
    token?: string
    role: Role
    userId: string
  }) => void

  logout: () => void
  setHasHydrated: (state: boolean) => void // (Used to detect when persisted state finished loading.)
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      userId: null,
      hasHydrated: false,

      setAuth: ({ token, role, userId }) =>
        set({
          token,
          role,
          userId,
        }),

      logout: () =>
        set({
          token: null,
          role: null,
          userId: null,
        }),

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "auth-storage",

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

