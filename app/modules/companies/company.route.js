import {Router} from 'express'
import CompanyController from './company.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), CompanyController.index)
router.post('/', auth(), CompanyController.create)
router.get('/my/employers', auth(), CompanyController.findEmployers)
router.put('/my/employers/:id', auth(), CompanyController.updateEmployer)
router.post('/my/employers', auth(), CompanyController.addEmployer)

export default router
