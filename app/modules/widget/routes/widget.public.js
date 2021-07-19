import {Router} from 'express'
import WidgetController from '../widget.controller'

const router = Router()

router.get('/:companyId', WidgetController.publicFindSettings)

export default router
