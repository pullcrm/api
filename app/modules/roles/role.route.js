import { Router } from 'express'
import RoleController from './role.controller'
import auth from '../../middlewares/auth'

const appointmentRouter = Router()

appointmentRouter.get('/', auth(), RoleController.index)
appointmentRouter.post('/', auth(), RoleController.create)

export default appointmentRouter
