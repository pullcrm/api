import {Router} from 'express'
import CategoryController from '../category.controller'
import auth from '../../../middlewares/auth'
import {ADMIN, MANAGER} from '../../../constants/roles'

const router = Router()

router.get('/', auth(), CategoryController.index)
router.post('/', auth([ADMIN, MANAGER]), CategoryController.create)
router.put('/:id', auth([ADMIN, MANAGER]), CategoryController.update)
router.delete('/:id', auth([ADMIN, MANAGER]), CategoryController.destroy)

export default router
