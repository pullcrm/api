import {Router} from 'express'
import SpecialistController from '../specialist.controller'
import auth from '../../../middlewares/auth'
import {ADMIN, MANAGER, SPECIALIST} from '../../../constants/roles'

const router = Router()

router.get('/', auth([ADMIN, MANAGER]), SpecialistController.index)
router.put('/bulk', auth([ADMIN]), SpecialistController.bulkUpdate)
router.put('/:id', auth([ADMIN]), SpecialistController.update)
router.delete('/:id', auth([ADMIN]), SpecialistController.destroy)
router.post('/', auth([ADMIN]), SpecialistController.create)
router.get('/:id/procedures', auth([ADMIN, MANAGER, SPECIALIST]), SpecialistController.getProcedures)
router.put('/:id/procedures', auth([ADMIN, MANAGER]), SpecialistController.updateProcedures)

export default router
