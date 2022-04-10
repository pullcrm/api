import {Router} from 'express'
import SMSController from './sms.controller'
import auth from '../../middlewares/auth'
import {ADMIN, MANAGER} from '../../constants/roles'

const router = Router()

router.get('/', auth([ADMIN, MANAGER]), SMSController.index)
router.post('/status', auth([ADMIN, MANAGER]), SMSController.status)
router.post('/settings', auth([ADMIN, MANAGER]), SMSController.addSettings)
router.put('/settings', auth([ADMIN, MANAGER]), SMSController.updateSettings)
router.delete('/settings', auth([ADMIN, MANAGER]), SMSController.deleteSettings)
router.post('/redirectUrl', SMSController.handleStatus)

export default router
