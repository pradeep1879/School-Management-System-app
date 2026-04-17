import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const getLoginRouteByRole = (
  role: ReturnType<typeof useAuthStore.getState>["role"],
) => {
  if (role === "teacher") {
    return "/teacher/login";
  }

  if (role === "student") {
    return "/student/login";
  }

  return "/";
};

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url ?? "");
    const isLoginRequest = requestUrl.includes("/login");

    if (status === 401 && !isLoginRequest) {
      const { token, role, logout } = useAuthStore.getState();

      if (token) {
        logout();

        const loginRoute = getLoginRouteByRole(role);

        if (window.location.pathname !== loginRoute) {
          window.location.replace(loginRoute);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;






// import { useAuthStore } from "@/store/auth.store";
// import axios from "axios";


// const api = axios.create({
//   baseURL: "http://localhost:3000/api/v1",
// });

// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().token;

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });
// localStorage.getItem("auth-storage")

// export default api;
