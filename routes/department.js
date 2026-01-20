import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {addDepartment,getDepartments,getDepartment} from '../controllers/departmentController.js'
const router=express.Router()
router.get('/',authMiddleware,getDepartments)
router.post('/add',authMiddleware,addDepartment)
router.get('/:id',authMiddleware,getDepartment)



export default router