import {Router} from 'express'
import CityController from './city.controller'
import auth from '../../middlewares/auth'
import {SUPER_ADMIN} from '../../constants/roles'

const router = Router()

router.get('/', auth(), CityController.index)
router.post('/', auth([SUPER_ADMIN]), CityController.create)

export default router
