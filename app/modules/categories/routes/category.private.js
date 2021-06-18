import {Router} from 'express'
import CategoryController from '../category.controller'
import auth from '../../../middlewares/auth'
import {ADMIN} from '../../../constants/roles'

const router = Router()

router.get('/', auth(), CategoryController.index)
router.post('/', auth([ADMIN]), CategoryController.create)
router.put('/:id', auth([ADMIN]), CategoryController.update)
router.delete('/:id', auth([ADMIN]), CategoryController.destroy)

export default router
