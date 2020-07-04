import {Router} from 'express'
import ApproachController from './approach.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), ApproachController.findMyApproaches)
router.get('/current', auth(), ApproachController.findMyCurrentApproach)

export default router
