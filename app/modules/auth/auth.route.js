import {Router} from 'express'
import auth from '../../middlewares/auth'
import AuthController from './auth.controller'

const router = Router()

router.post('/login', AuthController.login)
router.delete('/logout', auth(), AuthController.logout)
router.put('/token', AuthController.refreshToken)

export default router
