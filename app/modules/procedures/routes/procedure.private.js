import {Router} from 'express'
import ProcedureController from '../procedure.controller'
import auth from '../../../middlewares/auth'

const router = Router()

router.get('/', auth(), ProcedureController.index)
router.post('/', auth(), ProcedureController.create)
router.put('/:id', auth(), ProcedureController.update)
router.delete('/:id', auth(), ProcedureController.destroy)

router.get('/categories', auth(), ProcedureController.getCategories)
router.post('/categories', auth(), ProcedureController.createCategory)
router.put('/categories/:id', auth(), ProcedureController.updateCategory)
router.delete('/categories/:id', auth(), ProcedureController.destroyCategory)

export default router
