import {Router} from 'express'
import UserController from './user.controller'
import auth from '../../middlewares/auth'

const router = Router()
router.post('/', UserController.create)
router.post('/confirmation', UserController.sendConfirmationCode)
router.post('/restore', UserController.resetPassword)

router.get('/profile', auth(), UserController.profile)
router.get('/search', auth(), UserController.search)

export default router
