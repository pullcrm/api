import { Router } from 'express'
import AuthController from './auth.controller'

const authRouter = Router()

authRouter.post('/login', AuthController.login)
authRouter.post('/logout', AuthController.logout)
authRouter.put('/token', AuthController.refreshToken)

export default authRouter
