import {Router} from 'express'
import SpecialistController from '../specialist.controller'
import auth from '../../../middlewares/auth'

const router = Router()

router.get('/', auth(), SpecialistController.findMySpecialists)

export default router
