import {Router} from 'express'
import UserController from './user.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), UserController.index)
router.post('/', UserController.registration)
router.get('/profile', auth(), UserController.profile)
router.post('/confirmation', UserController.sendConfirmationCode)
router.get('/search', auth(), UserController.search)

export default router
