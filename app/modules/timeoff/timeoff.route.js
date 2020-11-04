import {Router} from 'express'
import TimeOffController from './timeoff.controller'
import auth from '../../middlewares/auth'

const router = Router()
router.get('/', TimeOffController.index)
router.post('/', auth(), TimeOffController.create)
router.put('/:id', auth(), TimeOffController.update)
router.delete('/:id', auth(), TimeOffController.destroy)

export default router
