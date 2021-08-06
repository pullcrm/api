import {Router} from 'express'
import TestsController from './tests.controller'

const router = Router()
router.get('/rdu', TestsController.removeDemoUser)

export default router
