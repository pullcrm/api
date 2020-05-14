import {Router} from 'express'
import ProcedureController from './procedure.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), ProcedureController.index)
// router.post('/', auth(), ProcedureController.create)

export default router
