import {Router} from 'express'
import WidgetController from '../widget.controller'
import auth from '../../../middlewares/auth'
import {ADMIN} from '../../../constants/roles'

const router = Router()
router.put('/', auth([ADMIN]), WidgetController.updateSettings)

export default router
