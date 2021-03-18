import {Router} from 'express'
import AnalyticsController from './analytics.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/finance', auth(), AnalyticsController.getFinancialAnalytics)
router.get('/calendar', auth(), AnalyticsController.getCalendarAnalytics)

export default router
