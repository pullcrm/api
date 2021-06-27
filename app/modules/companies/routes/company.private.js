import {Router} from 'express'
import CompanyController from '../company.controller'
import auth from '../../../middlewares/auth'
import {ADMIN, MANAGER, SPECIALIST} from '../../../constants/roles'

const router = Router()

router.get('/', auth([ADMIN]), CompanyController.index)
router.post('/', auth(), CompanyController.create)
router.put('/:id', auth([ADMIN, MANAGER]), CompanyController.update)
router.get('/:id', auth([ADMIN, MANAGER, SPECIALIST]), CompanyController.show)

router.post('/my/settings', auth([ADMIN, MANAGER]), CompanyController.addSettings)
router.put('/my/settings', auth([ADMIN, MANAGER]), CompanyController.updateSettings)
router.delete('/my/settings', auth([ADMIN, MANAGER]), CompanyController.deleteSettings)
router.get('/my/stats', auth([ADMIN]), CompanyController.getStats)
router.get('/my/types', auth(), CompanyController.getTypes)

export default router
