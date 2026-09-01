import express from 'express'
import { addComment, addPlan, deletePlan, getPlans, updatePlan } from '../controllers/workout.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const route = express.Router()

route.post('/add', verifyToken, addPlan)
route.put('/update/:id', verifyToken, updatePlan)
route.delete('/delete', verifyToken, deletePlan)
route.post('/:id', verifyToken, addComment)
route.get('/', verifyToken, getPlans)

export default route