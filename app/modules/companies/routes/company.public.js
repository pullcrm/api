import {Router} from 'express'
import CompanyController from '../company.controller'

const router = Router()

router.get('/', CompanyController.globalIndex)
router.get('/types', CompanyController.getTypes)
router.get('/:id', CompanyController.publicGetCompany)

export default router
