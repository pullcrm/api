import {Router} from 'express'
import CategoryController from './category.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), CategoryController.index) // ALL
router.post('/', auth(), CategoryController.create) // SUPER ADMIN

export default router
