import {Router} from 'express'
import SpecialistController from '../specialist.controller'

const router = Router()

router.get('/', SpecialistController.publicIndex)

export default router
