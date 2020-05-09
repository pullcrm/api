import {Router} from 'express'
import UserController from './user.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), UserController.index)
router.post('/', UserController.create)
router.get('/profile', auth(), UserController.profile)

export default router
