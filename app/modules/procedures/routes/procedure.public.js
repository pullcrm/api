import {Router} from 'express'
import ProcedureController from '../procedure.controller'

const router = Router()

router.get('/', ProcedureController.publicFindAllProcedures)

export default router
