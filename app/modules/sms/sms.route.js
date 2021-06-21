import {Router} from 'express'
import SMSController from './sms.controller'
import auth from '../../middlewares/auth'
import {ADMIN, MANAGER, SPECIALIST} from '../../constants/roles'

const router = Router()

router.get('/balance', auth([ADMIN, SPECIALIST, MANAGER]), SMSController.balance)
router.post('/status', auth([ADMIN, MANAGER]), SMSController.status)
router.post('/remove', auth([ADMIN, MANAGER]), SMSController.removeSms)
// router.post('/send', SMSController.sendSms)

export default router
