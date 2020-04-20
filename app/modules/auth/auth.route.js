import { Router } from 'express'
import AuthController from './auth.controller'

const authRouter = Router()

authRouter.post('/login', AuthController.login)

export default authRouter
