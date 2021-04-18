import {Router} from 'express'
import TomeWorkController from '../timework.controller'

const router = Router()
router.get('/:companyId', TomeWorkController.publicFindTimeWork)

export default router
