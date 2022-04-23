import {Router} from 'express'
import SupportController from './support.controller'

const router = Router()

router.post('/', SupportController.sendMessage)

export default router
