import {Router} from 'express'
import CompanyController from '../company.controller'
import auth from '../../../middlewares/auth'
import {ADMIN, MANAGER, SPECIALIST} from '../../../constants/roles'

const router = Router()

router.get('/', auth([ADMIN]), CompanyController.index)
router.post('/', auth(), CompanyController.create)
router.put('/:id', auth([ADMIN, MANAGER]), CompanyController.update)
router.get('/:id', auth([ADMIN, MANAGER, SPECIALIST]), CompanyController.show)
router.get('/my/stats', auth([ADMIN]), CompanyController.getStats)
router.get('/my/types', auth([ADMIN]), CompanyController.getTypes)

export default router
