import { Router } from 'express'
import UserController from './user.controller'
import auth from '../../middlewares/auth'

const userRouter = Router()

userRouter.get('/', auth(), UserController.index)
userRouter.post('/', UserController.create)

export default userRouter
