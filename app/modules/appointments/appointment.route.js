import {Router} from 'express'
import AppointmentController from './appointment.controller'
import auth from '../../middlewares/auth'

const appointmentRouter = Router()

appointmentRouter.get('/', AppointmentController.index)
appointmentRouter.post('/', auth(), AppointmentController.create)

export default appointmentRouter
