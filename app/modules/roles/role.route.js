import {Router} from 'express'
import RoleController from './role.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), RoleController.index)
// router.post('/', auth(), RoleController.create)

export default router
