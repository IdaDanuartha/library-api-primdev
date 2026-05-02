import express from 'express'
import {
    register,
    login
} from '../controllers/index.controllers.js'
import {
    registerValidation,
    loginValidation
} from '../validations/auth.validations.js'

const router = express.Router()

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)

export default router