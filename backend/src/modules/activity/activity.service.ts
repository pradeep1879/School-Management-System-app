// @ts-nocheck
import { client } from "../../prisma/db.ts";

export const createActivity = async (body, userId, role) => {
  const { title, description, type, startDate, endDate, classId } = body;
  
  if (!title || !type || !classId) {
    throw new Error("Title, type and class are required");
  }

  const start = startDate ? new Date(startDate) : null;
  const end   = endDate ? new Date(endDate) : null;

  if (start) start.setHours(0,0,0,0);
  if (end)   end.setHours(23,59,59,999);

  const activity = await client.activity.create({
    data: {
      title,
      description,
      type,
      startDate: start ? new Date(startDate) : null,
      endDate:   end ? new Date(endDate) : null,
      classId,
      teacherId: role === "teacher" ? userId : null,
      adminId: role === "admin" ? userId : null,
    },
  });

  return {
    message: "Activity created successfully",
    activity,
  };
};


export const getActivityById = async (activityId) => {
  const activity = await client.activity.findUnique({
    where: { id: activityId },
    include: {
      class: true,
      teacher: true,
    },
  });

  if (!activity) throw new Error("Activity not found");

  return activity;
};


export const getActivitiesByClass = async (classId) => {
  if (!classId) throw new Error("Class ID required");

  const now = new Date();

  //  Bulk update expired activities
  await client.activity.updateMany({
    where: {
      classId,
      endDate: { lt: now },
      status: { not: "COMPLETED" },
    },
    data: {
      status: "COMPLETED",
    },
  });

  //  Fetch updated activities
  const activities = await client.activity.findMany({
    where: { classId },
    include: {
      teacher: {
        select: {
          id: true,
          teacherName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { activities };
};


export const updateActivityStatus = async (
  activityId,
  status,
  role,
  userId
) => {
  if (!activityId) throw new Error("Activity ID is required");

  const allowedStatuses = ["ACTIVE", "PENDING", "COMPLETED", "CANCELLED"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  const existingActivity = await client.activity.findUnique({
    where: { id: activityId },
    select: {
      id: true,
      teacherId: true,
      status: true,
    },
  });

  if (!existingActivity) {
    throw new Error("Activity not found");
  }

  if (role === "student") {
    throw new Error("Students cannot update activity status");
  }

  if (role === "teacher" && existingActivity.teacherId !== userId) {
    throw new Error("Unauthorized access");
  }

  if (
    existingActivity.status === "COMPLETED" &&
    status !== "COMPLETED"
  ) {
    throw new Error("Completed activity cannot be modified");
  }

  const updatedActivity = await client.activity.update({
    where: { id: activityId },
    data: { status },
  });

  return {
    message: "Activity status updated successfully",
    activity: updatedActivity,
  };
};
