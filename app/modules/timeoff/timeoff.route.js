import {Router} from 'express'
import TimeOffController from './timeoff.controller'
import auth from '../../middlewares/auth'
import {ADMIN, MANAGER, SPECIALIST} from '../../constants/roles'

const router = Router()
router.get('/', TimeOffController.index)
router.post('/', auth([ADMIN, MANAGER, SPECIALIST]), TimeOffController.create)
router.put('/:id', auth([ADMIN, MANAGER, SPECIALIST]), TimeOffController.update)
router.delete('/:id', auth([ADMIN, MANAGER, SPECIALIST]), TimeOffController.destroy)

export default router
