import {Router} from 'express'
import RoleController from './role.controller'
import auth from '../../middlewares/auth'
import {ADMIN} from '../../constants/roles'

const router = Router()

router.get('/', auth([ADMIN]), RoleController.index)
// router.post('/', auth(), RoleController.create)

export default router
