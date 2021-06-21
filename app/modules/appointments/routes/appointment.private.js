import {Router} from 'express'
import AppointmentController from '../appointment.controller'
import auth from '../../../middlewares/auth'
import {ADMIN, MANAGER, SPECIALIST} from '../../../constants/roles'

const router = Router()

router.get('/',  auth([ADMIN, MANAGER, SPECIALIST]), AppointmentController.index)
router.post('/', auth([ADMIN, MANAGER, SPECIALIST]), AppointmentController.create)
router.put('/:id', auth([ADMIN, MANAGER]), AppointmentController.update)
router.delete('/:id', auth([ADMIN, MANAGER]), AppointmentController.destroy)
router.get('/queue',  auth([ADMIN, MANAGER, SPECIALIST]), AppointmentController.queue)
router.put('/:id/sms', auth([ADMIN, MANAGER]), AppointmentController.changeSMSIdentifier)
router.post('/available-time',  auth([ADMIN, MANAGER, SPECIALIST]), AppointmentController.availableTime)

export default router
