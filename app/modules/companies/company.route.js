import {Router} from 'express'
import CompanyController from './company.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), CompanyController.index)
router.post('/', auth(), CompanyController.create)
router.get('/my/staff', auth(), CompanyController.findStaff)
router.put('/my/staff/:id', auth(), CompanyController.updateEmployee)
router.post('/my/staff', auth(), CompanyController.addEmployee)

export default router
