// import { subscribe } from "../events/eventBus.ts";
// import { broadcastToRoom } from "../ws/roomManager.ts";
// import { createNotification } from "./notification.service.ts";


// subscribe("exam_created", async (payload) => {

//   const notification = await createNotification({
//     title: "New Exam Created",
//     message: payload.title,
//     classId: payload.classId,
//     type: "Exam"
//   })

//   broadcastToRoom(payload.classId, {
//     type: "exam_created",
//     notification
//   });

// });
