import {Router} from 'express'
import SMSController from './sms.controller'
import auth from '../../middlewares/auth'
import {ADMIN} from '../../constants/roles'

const router = Router()

router.get('/balance', auth([ADMIN]), SMSController.balance)
router.post('/status', auth([ADMIN]), SMSController.status)
router.post('/remove', auth([ADMIN]), SMSController.removeSms)
// router.post('/send', SMSController.sendSms)

export default router
