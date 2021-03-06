import {Router} from 'express'
import AnalyticsController from './analytics.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/finance', auth(), AnalyticsController.getFinancialAnalytics)

export default router
