import {Router} from 'express'
import CategoryController from '../category.controller'
import auth from '../../../middlewares/auth'

const router = Router()

router.get('/', auth(), CategoryController.index)
router.post('/', auth(), CategoryController.create)
router.put('/:id', auth(), CategoryController.update)
router.delete('/:id', auth(), CategoryController.destroy)

export default router
