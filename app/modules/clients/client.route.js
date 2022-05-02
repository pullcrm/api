import {Router} from 'express'
import ClientController from './client.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), ClientController.index)
router.post('/', auth(), ClientController.create)
router.get('/findByPhoneOrName', auth(), ClientController.findByPhoneOrName)

export default router
