import {Router} from 'express'
import NotificationController from './notification.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.post('/balance/', auth(), NotificationController.balance)

export default router
