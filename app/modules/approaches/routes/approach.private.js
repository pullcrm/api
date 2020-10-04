import {Router} from 'express'
import ApproachController from '../approach.controller'
import auth from '../../../middlewares/auth'

const router = Router()

router.get('/', auth(), ApproachController.findMyApproaches)

export default router
