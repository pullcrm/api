import {Router} from 'express'
import TomeWorkController from '../timework.controller'

const router = Router()

//TODO in future, it can be attached to the 'company' entity
router.get('/:companyId', TomeWorkController.publicFindTimeWork)

export default router
