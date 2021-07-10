import joi from "joi"
import WidgetService from './widget.service'
import validate from "../../utils/validate"

export default {
  updateSettings: async (req, res, next) => {
    try {
      const formattedData = {
        isActive: req.body.isActive,
        isQueue: req.body.isQueue,
        daysForward: req.body.daysForward,
        minutesBefore: req.body.minutesBefore
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        isActive: joi.boolean(),
        isQueue: joi.boolean(),
        companyId: joi.number().required(),
        userId: joi.number().required(),
        daysForward: joi.number(),
        minutesBefore: joi.number()
      }))

      const settings = await WidgetService.update(formattedData, params)

      res.send(settings)
    } catch (error) {
      next(error)
    }
  },

  publicFindSettings: async (req, res, next) => {
    try {
      const formattedData = {
        companyId: req.params.companyId
      }

      validate(formattedData, joi.object().keys({
        companyId: joi.number()
      }))

      const settings = await WidgetService.findOne(formattedData)
      res.send(settings)
    } catch (error) {
      next(error)
    }
  },
}
