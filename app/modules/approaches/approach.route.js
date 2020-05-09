import {Router} from 'express'
import ApproachController from './approach.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), ApproachController.index)
router.post('/', auth(), ApproachController.create)

export default router
