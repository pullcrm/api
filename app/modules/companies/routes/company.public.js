import {Router} from 'express'
import CompanyController from '../company.controller'

const router = Router()

router.get('/:id', CompanyController.publicGetCompany)

export default router
