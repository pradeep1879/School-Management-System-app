import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createActivity, getActivitiesByClass, updateActivity } from "../api/activity.api";
import { toast } from "sonner";



export const useActivities = (classId?: string) => {
  return useQuery({
    queryKey: ["activities", classId],
    queryFn: () => getActivitiesByClass(classId as string),
    enabled: !!classId,
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivity,
    onSuccess: (res, variables) => {
      toast.success(res?.data?.message || "Activity created")
      queryClient.invalidateQueries({
        queryKey: ["activities", variables.classId],
      });
    },
  });
};


type StatusType = "ACTIVE" | "PENDING" | "COMPLETED" | "CANCELLED";

type UpdatePayload = {
  activityId: string;
  status: StatusType;
  classId: string;
};

export const useUpdateActivityStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activityId, status }: UpdatePayload) =>
      updateActivity(activityId, status),

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async ({ activityId, status, classId }) => {
      await queryClient.cancelQueries({
        queryKey: ["activities", classId],
      });

      const previousData = queryClient.getQueryData<any>([
        "activities",
        classId,
      ]);

      queryClient.setQueryData(["activities", classId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          activities: old.activities.map((activity: any) =>
            activity.id === activityId
              ? { ...activity, status }
              : activity
          ),
        };
      });

      return { previousData };
    },

    // ROLLBACK IF ERROR
    onError: (_err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["activities", variables.classId],
          context.previousData
        );
      }
    },

    // FINAL SYNC
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["activities", variables.classId],
      });
    },
  });
};


