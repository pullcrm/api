import {Router} from 'express'
import SMSController from './sms.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.post('/', auth(), SMSController.addSMSConfiguration)
router.put('/', auth(), SMSController.updateSMSConfiguration)
router.get('/balance', auth(), SMSController.balance)
router.post('/status', auth(), SMSController.status)
router.post('/remove', auth(), SMSController.removeSms)
router.post('/send', SMSController.sendSms)

export default router
