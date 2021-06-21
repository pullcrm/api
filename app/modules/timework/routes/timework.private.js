import {Router} from 'express'
import TimeWorkController from '../timework.controller'
import auth from '../../../middlewares/auth'
import {ADMIN} from '../../../constants/roles'

const router = Router()
router.put('/', auth([ADMIN]), TimeWorkController.update)

export default router
