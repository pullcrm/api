import {Router} from 'express'
import ProcedureController from '../procedure.controller'
import auth from '../../../middlewares/auth'

const router = Router()

router.get('/', auth(), ProcedureController.index)
router.post('/', auth(), ProcedureController.create)
router.put('/bulk', auth(), ProcedureController.bulkUpdate)
router.put('/:id', auth(), ProcedureController.update)
router.delete('/:id', auth(), ProcedureController.destroy)

export default router
