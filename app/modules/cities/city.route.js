import {Router} from 'express'
import CityController from './city.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), CityController.index) // ALL
router.post('/', auth(), CityController.create) // SUPER ADMIN

export default router
