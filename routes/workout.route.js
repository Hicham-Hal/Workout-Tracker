import express from 'express'
import { addPlan, deletePlan, updatePlan } from '../controllers/workout.controller.js'

const route = express.Router()

route.post('/add', addPlan)
route.post('/update', updatePlan)
route.post('/delete', deletePlan)

export default route