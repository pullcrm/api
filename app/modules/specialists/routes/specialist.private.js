import {Router} from 'express'
import SpecialistController from '../specialist.controller'
import auth from '../../../middlewares/auth'

const router = Router()

router.get('/', auth(), SpecialistController.index)
router.put('/bulk', auth(), SpecialistController.bulkUpdate)
router.put('/:id', auth(), SpecialistController.update)
router.delete('/:id', auth(), SpecialistController.destroy)
router.post('/', auth(), SpecialistController.create)
router.get('/:id/procedures', auth(), SpecialistController.getProcedures)
router.put('/:id/procedures', auth(), SpecialistController.updateProcedures)

export default router
