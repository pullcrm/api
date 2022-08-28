import {Router} from 'express'
import SpecialistController from '../specialist.controller'
import auth from '../../../middlewares/auth'
import {ADMIN, MANAGER, SPECIALIST} from '../../../constants/roles'

const router = Router()

router.get('/', auth([ADMIN, MANAGER]), SpecialistController.index)
router.get('/:id', auth([ADMIN, MANAGER, SPECIALIST]), SpecialistController.show)
router.put('/bulk', auth([ADMIN, MANAGER]), SpecialistController.bulkUpdate)
router.put('/:id', auth([ADMIN, MANAGER, SPECIALIST]), SpecialistController.update)
router.delete('/:id', auth([ADMIN]), SpecialistController.destroy)
router.post('/', auth([ADMIN]), SpecialistController.create)
router.get('/:id/procedures', auth([ADMIN, MANAGER, SPECIALIST]), SpecialistController.getProcedures)
router.put('/:id/procedures', auth([ADMIN, MANAGER]), SpecialistController.updateProcedures)
router.get('/:id/sendFinishLink', auth([ADMIN]), SpecialistController.sendFinishLink)
router.post('/:id/addTimeOff', auth([SPECIALIST]), SpecialistController.addTimeOff)
router.post('/:id/addTimeWork', auth([SPECIALIST]), SpecialistController.addTimeWork)
router.get('/:id/timeWork', auth([ADMIN, MANAGER, SPECIALIST]), SpecialistController.getTimeWork)

export default router
