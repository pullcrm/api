import joi from "joi"
import TimeOffService from './timeoff.service'
import validate from "../../utils/validate"

export default {
  index: async (req, res, next) => {
    try {
      const params = {
        employeeId: req.query.employeeId,
        endDateTime: req.query.endDateTime,
        startDateTime: req.query.startDateTime,
      }

      const timeOffs = await TimeOffService.findAll(params)

      res.send(timeOffs)
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        employeeId: req.body.employeeId,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime
      }

      const params = {
        userId: req.userId
      }

      validate({...formattedData,  ...params}, joi.object().keys({
        employeeId: joi.number().required(),
        startDateTime: joi.string().required(),
        endDateTime: joi.string().required(),
        userId: joi.number().required()
      }))

      const timeoff = await TimeOffService.create({...formattedData,  ...params})
      res.send(timeoff)
    } catch(error) {
      next(error)
    }
  },
}
