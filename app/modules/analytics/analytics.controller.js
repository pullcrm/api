import joi from "../../utils/joi"
import validate from "../../utils/validate"
import AnalyticsService from './analytics.service'

export default {
  getFinancialAnalytics: async (req, res, next) => {
    try {
      const formattedData = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        specialistId: req.query.specialistId,
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...params}, joi.object().keys({
        userId: joi.number().required(),
        companyId: joi.number().required(),
        startDate: joi.string(),
        endDate: joi.string(),
      }))

      const stats = await AnalyticsService.getFinancialAnalytics(formattedData, params)

      res.send(stats)

    } catch (error) {
      next(error)
    }
  },

  getCalendarAnalytics: async (req, res, next) => {
    try {
      const formattedData = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        specialistId: req.query.specialistId
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...params}, joi.object().keys({
        userId: joi.number().required(),
        companyId: joi.number().required(),
        startDate: joi.string(),
        endDate: joi.string(),
      }))

      const stats = await AnalyticsService.getCalendarAnalytics(formattedData, params)

      res.send(stats)

    } catch (error) {
      next(error)
    }
  },

  getDashboardAnalytics: async (req, res, next) => {
    try {
      const formattedData = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        specialistId: req.query.specialistId
      }

      const params = {
        userId: req.userId
      }

      validate({...params}, joi.object().keys({
        userId: joi.number().required(),
        startDate: joi.string(),
        endDate: joi.string(),
      }))

      const stats = await AnalyticsService.getDashboardAnalytics(formattedData, params)

      res.send(stats)

    } catch (error) {
      next(error)
    }
  },
}

