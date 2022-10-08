import {Router} from 'express'
import BalanceController from './balance.controller'
import auth from '../../middlewares/auth'
import {ADMIN, MANAGER, SPECIALIST} from '../../constants/roles'

const router = Router()

router.get('/', auth([ADMIN, MANAGER, SPECIALIST]), BalanceController.getBalance)
router.get('/history', auth([ADMIN, MANAGER]), BalanceController.getBalanceHistory)
router.post('/checkout', auth([ADMIN, MANAGER]), BalanceController.checkout)
router.post('/redirectUrl', BalanceController.redirectUrl)

export default router
