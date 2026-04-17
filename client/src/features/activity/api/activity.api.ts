import api from "@/api/axios";

// Create
export const createActivity = async (data: any) => {
  const res = await api.post("/activity", data);
  return res.data;
};

// Get by class
export const getActivitiesByClass = async (classId: string) => {
  const res = await api.get("/activity", {
    params: { classId },
  });
  return res.data;
};


export const updateActivity = async (
  activityId:string,
  status: "ACTIVE" | "PENDING" | "COMPLETED" | "CANCELLED") =>{
  const res = await api.patch(`/activity/${activityId}/status`,{
    status
  })
  return res.data;
}

