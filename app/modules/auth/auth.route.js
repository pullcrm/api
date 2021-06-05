import {Router} from 'express'
import AuthController from './auth.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.put('/token', auth(), AuthController.refreshToken)

export default router
