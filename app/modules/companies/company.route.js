import { Router } from 'express'
import CompanyController from './company.controller'
import auth from '../../middlewares/auth'

const userRouter = Router()

userRouter.get('/', auth(), CompanyController.index)
userRouter.post('/', CompanyController.create)

export default userRouter
