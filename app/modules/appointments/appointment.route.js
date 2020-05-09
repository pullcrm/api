import {Router} from 'express'
import AppointmentController from './appointment.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', AppointmentController.index)
router.post('/', auth(), AppointmentController.create)

export default router
