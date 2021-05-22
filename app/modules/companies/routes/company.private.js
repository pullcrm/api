import {Router} from 'express'
import CompanyController from '../company.controller'
import auth from '../../../middlewares/auth'

const router = Router()

router.get('/', auth(), CompanyController.index)
router.post('/', auth(), CompanyController.create)
router.put('/:id', auth(), CompanyController.update)
router.get('/:id', auth(), CompanyController.show)

router.post('/my/settings', auth(), CompanyController.addSettings)
router.put('/my/settings', auth(), CompanyController.updateSettings)
router.delete('/my/settings', auth(), CompanyController.deleteSettings)
router.get('/my/stats', auth(), CompanyController.getStats)
router.get('/my/types', auth(), CompanyController.getTypes)

export default router
