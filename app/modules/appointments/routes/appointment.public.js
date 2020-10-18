import {Router} from 'express'
import AppointmentController from '../appointment.controller'

const router = Router()

router.post('/', AppointmentController.publicCreation)
router.post('/slots', AppointmentController.publicHoursSlots)

export default router
