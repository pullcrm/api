import {Router} from 'express'
import CompanyController from './company.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), CompanyController.index)
router.post('/', auth(), CompanyController.create)

export default router
