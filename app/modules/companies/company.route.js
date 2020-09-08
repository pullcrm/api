import {Router} from 'express'
import CompanyController from './company.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), CompanyController.index)
router.post('/', auth(), CompanyController.create)
router.put('/:id', auth(), CompanyController.update)
router.get('/:id', auth(), CompanyController.show)
router.get('/my/staff', auth(), CompanyController.findStaff)
router.put('/my/staff/:id', auth(), CompanyController.updateEmployee)
router.put('/my/employees/:id', auth(), CompanyController.updateEmployeeStatus)
router.post('/my/staff', auth(), CompanyController.addEmployee)
router.post('/my/sms', auth(), CompanyController.addSMSConfiguration)

export default router
