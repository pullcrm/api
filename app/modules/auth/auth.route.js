import { Router } from 'express'
import AuthController from './auth.controller'
import auth from '../../middlewares/auth'

const authRouter = Router()

authRouter.post('/', auth(), AuthController.login)

export default authRouter
