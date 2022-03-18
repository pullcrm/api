import {Router} from 'express'
import BalanceController from './balance.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.post('/checkout', auth(), BalanceController.checkout)

export default router
