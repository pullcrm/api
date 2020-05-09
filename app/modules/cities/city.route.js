import {Router} from 'express'
import CityController from './city.controller'
import auth from '../../middlewares/auth'

const cityRouter = Router()

cityRouter.get('/', auth(), CityController.index) // ALL
cityRouter.post('/', auth(), CityController.create) // SUPER ADMIN

export default cityRouter
