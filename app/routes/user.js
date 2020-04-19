import { Router } from 'express'
import UserController from '../modules/users/user.controller'

const router = Router()

router.get('/', UserController.index)

export default router
