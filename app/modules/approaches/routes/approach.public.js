import {Router} from 'express'
import ApproachController from '../approach.controller'

const router = Router()

router.get('/', ApproachController.publicFindAllEmployees)

export default router
