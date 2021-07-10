import {Router} from 'express'
import ProcedureController from '../procedure.controller'
import auth from '../../../middlewares/auth'
import {ADMIN, MANAGER, SPECIALIST} from '../../../constants/roles'

const router = Router()

router.get('/', auth([ADMIN, MANAGER, SPECIALIST]), ProcedureController.index)
router.post('/', auth([ADMIN, MANAGER]), ProcedureController.create)
router.put('/bulk', auth(ADMIN, MANAGER), ProcedureController.bulkUpdate)
router.put('/:id', auth([ADMIN, MANAGER]), ProcedureController.update)
router.delete('/:id', auth([ADMIN, MANAGER]), ProcedureController.destroy)

export default router
