import express from 'express'
import { addPlan, deletePlan, updatePlan } from '../controllers/workout.controller.js'

const route = express.Router()

route.post('/add', addPlan)
route.put('/update/:id', updatePlan)
route.delete('/delete', deletePlan)

export default route