import {Router} from 'express'
import AppointmentController from '../appointment.controller'
import auth from '../../../middlewares/auth'

const router = Router()

router.get('/',  auth(), AppointmentController.index)
router.post('/', auth(), AppointmentController.create)
router.put('/:id', auth(), AppointmentController.update)
router.delete('/:id', auth(), AppointmentController.destroy)
router.put('/:id/sms', auth(), AppointmentController.changeSMSIdentifier)

router.post('/slots',  auth(), AppointmentController.hoursSlots)

export default router
