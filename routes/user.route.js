import express from 'express'
import { login, register, logout } from '../controllers/user.controller.js'
import { loginValidators, registerValidators } from '../validators/auth.validator.js'
import { validate } from '../validators/validate.js'

const route = express.Router()

route.post('/login', loginValidators, validate, login)
route.post('/register', registerValidators, validate, register)
route.post('/logout', logout)

export default route