import express from 'express'
import { addComment, addPlan, deleteComment, deletePlan, getPlans, getReport, updatePlan, updateStatus } from '../controllers/workout.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { updateStatusValidator } from '../validators/workout.validator.js'
import { validate } from '../validators/validate.js'

const route = express.Router()

route.post('/add', verifyToken, addPlan)
route.put('/update/:id', verifyToken, updatePlan)
route.delete('/delete', verifyToken, deletePlan)
route.post('/:id', verifyToken, addComment)
route.delete('/:planId', verifyToken, deleteComment)
route.get('/', verifyToken, getPlans)
route.put('/:id/status', verifyToken, updateStatusValidator, validate, updateStatus )
route.get('/report', verifyToken, getReport)

export default route