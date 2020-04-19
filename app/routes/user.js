import { Router } from 'express'
import UserController from '../modules/users/UserController.js'

const router = Router()

router.get('/', UserController.index)

export default router
