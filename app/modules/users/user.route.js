import {Router} from 'express'
import UserController from './user.controller'
import auth from '../../middlewares/auth'

const router = Router()
router.post('/', UserController.create)
router.get('/profile', auth(), UserController.profile)
router.post('/confirmation', UserController.sendConfirmationCode)
router.get('/search', auth(), UserController.search)

export default router
