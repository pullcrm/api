import {Router} from 'express'
import AnalyticsController from './analytics.controller'
import auth from '../../middlewares/auth'
import {ADMIN} from '../../constants/roles'

const router = Router()

router.get('/finance', auth([ADMIN]), AnalyticsController.getFinancialAnalytics)
router.get('/calendar', auth([ADMIN]), AnalyticsController.getCalendarAnalytics)
router.get('/dashboard', auth([ADMIN]), AnalyticsController.getDashboardAnalytics)

export default router
