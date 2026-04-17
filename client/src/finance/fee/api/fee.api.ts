import api from "@/api/axios";

export const  getDashboard = () => {
 return api.get("/fees/dashboard")
}

export const createStudent = (data: FormData) => {
  return api.post("/students", data);
};