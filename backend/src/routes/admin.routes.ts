import express from 'express'
import { adminLogin, adminSignup, classDetailByAdmin, classDetails, createClass,
     createFee, createTeacher, deleteClass, getAdminProfile, getAllClasses, getAllTeachers, getFeeHistory, getTeacherDetail,
      schoolDetailByAdmin,
      studentDetailByAdmin, updateAdminProfile, updateClass} from '../controllers/admin.controller.ts'
import adminMiddleware from '../middlewares/admin.middleware.js'
// import teacherMiddleware from '../middlewares/teacher.middleware.js'
const routes = express.Router()


routes.post('/signup', adminSignup)
routes.post('/login', adminLogin)
routes.get('/profile',adminMiddleware, getAdminProfile)
routes.put('/update/profile', adminMiddleware, updateAdminProfile)

routes.post('/create-teacher', adminMiddleware, createTeacher)
routes.get('/get-allteachers', getAllTeachers)// changed for class : to get all teachers for subject
routes.get('/teacher-detail/:teacherId', getTeacherDetail)

routes.post('/create-class', adminMiddleware,  createClass)
routes.get('/class-detail-admin/:classId', adminMiddleware, classDetailByAdmin)
routes.get('/class-detail/:classId', classDetails)
routes.put('/class-update/:classId', updateClass)
routes.get('/get-classes', adminMiddleware, getAllClasses)
routes.delete('/delete-class/:classId', adminMiddleware, deleteClass)
routes.get('/student-detail-admin/:studentId', adminMiddleware, studentDetailByAdmin)
routes.post('/create-fee/:studentId', adminMiddleware, createFee)
routes.get('/fee-history/:studentId',  getFeeHistory)
routes.get('/get-school-detail',adminMiddleware,  schoolDetailByAdmin)

export default routes







