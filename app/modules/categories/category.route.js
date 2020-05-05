import { Router } from 'express'
import CategoryController from './category.controller'
import auth from '../../middlewares/auth'

const categoryRouter = Router()

categoryRouter.get('/', auth(), CategoryController.index) // ALL
categoryRouter.post('/', auth(), CategoryController.create) // SUPER ADMIN

export default categoryRouter
