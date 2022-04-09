import {Router} from 'express'
import BalanceController from './balance.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), BalanceController.getBalance)
router.post('/checkout', auth(), BalanceController.checkout)
router.post('/redirectUrl', BalanceController.redirectUrl)

export default router
