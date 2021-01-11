import {Router} from 'express'
import CompanyController from '../company.controller'
import auth from '../../../middlewares/auth'

const router = Router()

router.get('/', auth(), CompanyController.index)
router.post('/', auth(), CompanyController.create)
router.put('/:id', auth(), CompanyController.update)
router.get('/:id', auth(), CompanyController.show)
router.get('/my/specialists', auth(), CompanyController.findSpecialists)
router.put('/my/specialists/:id', auth(), CompanyController.updateSpecialist)
router.post('/my/specialists', auth(), CompanyController.addSpecialist)

export default router
