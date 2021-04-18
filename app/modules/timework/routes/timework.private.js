import {Router} from 'express'
import TimeWorkController from '../timework.controller'
import auth from '../../../middlewares/auth'

const router = Router()
router.put('/', auth(), TimeWorkController.update)

export default router
