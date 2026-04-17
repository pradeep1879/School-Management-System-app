import express from 'express'
import { createStudent, 
         teacherLogin, classDetailByTeacher, 
         getAllClasses,
         createSubjects,
         createAttendance,
         studentDetailByTeacher,
         getAttendanceOfStudent,
         createAssignment,
         getProfile,
         updateTeacherProfile} from '../controllers/teacher.controller.ts'

import teacherMiddleware from '../middlewares/teacher.middleware.js'




const routes = express.Router()



routes.post('/login', teacherLogin)
routes.get('/profile', teacherMiddleware, getProfile)
routes.put('/update/profile', teacherMiddleware, updateTeacherProfile)

routes.get('/class-detail-teacher/:classId', teacherMiddleware, classDetailByTeacher)
routes.get('/get-classes', teacherMiddleware, getAllClasses)
routes.post('/create-student', teacherMiddleware, createStudent)
// routes.post('/create-fee', teacherMiddleware, createFee)

routes.get('/student-detail-teacher/:studentId', teacherMiddleware, studentDetailByTeacher)
routes.post('/create-subject/:classId',  createSubjects)
routes.post('/create-attendance/:classId', teacherMiddleware,  createAttendance)
routes.get('/get-attendance/:studentId',   getAttendanceOfStudent)
routes.post('/create-assignment/:classId',teacherMiddleware,   createAssignment)


export default routes
