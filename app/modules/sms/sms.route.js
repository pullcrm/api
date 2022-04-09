import {Router} from 'express'
import SMSController from './sms.controller'
import auth from '../../middlewares/auth'
import {ADMIN, MANAGER} from '../../constants/roles'
import SMSScheduler from '../../jobs/sms.scheduler'
import SMSGlobalService from './services/sms.global'

const router = Router()

// router.get('/balance', auth([ADMIN, SPECIALIST, MANAGER]), SMSController.balance)
router.post('/status', auth([ADMIN, MANAGER]), SMSController.status)
router.post('/settings', auth([ADMIN, MANAGER]), SMSController.addSettings)
router.put('/settings', auth([ADMIN, MANAGER]), SMSController.updateSettings)
router.delete('/settings', auth([ADMIN, MANAGER]), SMSController.deleteSettings)
router.post('/redirectUrl', SMSController.handleStatus)

router.post('/send', async (req, res) => {
  
  const queueResponse = await SMSGlobalService.sendImmediate({
    phone: req.body.phone,
    message: req.body.message,
  }, {userId: 5, companyId: 1})
  res.send(queueResponse)
})

export default router
