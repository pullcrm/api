import {Router} from 'express'
import SmscController from './smsc.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.post('/balance/', auth(), SmscController.balance)
router.post('/remove/', auth(), SmscController.removeSms)
router.post('/send/', auth(), SmscController.sendSms)

export default router
