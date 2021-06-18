import {Router} from 'express'
import SpecialistController from '../specialist.controller'

const router = Router()

router.get('/', SpecialistController.publicIndex)
router.get('/:id', SpecialistController.publicFindOne)

export default router
