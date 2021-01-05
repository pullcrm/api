import {Router} from 'express'
import SpecialistController from '../specialist.controller'

const router = Router()

router.get('/', SpecialistController.publicFindMySpecialists)

export default router
