import joi from "joi"
import TimeOffService from './timeoff.service'
import validate from "../../utils/validate"

export default {
  create: async (req, res, next) => {
    try {
      const formattedData = {
        employeeId: req.body.employeeId,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime
      }

      const params = {
        userId: req.userId
      }

      validate({...formattedData,  ...params}, joi.object().keys({
        employeeId: joi.number().required(),
        date: joi.string().required(),
        startTime: joi.string().required(),
        endTime: joi.string().required(),
        userId: joi.number().required()
      }))

      const timeoff = await TimeOffService.create({...formattedData,  ...params})
      res.send(timeoff)
    } catch(error) {
      next(error)
    }
  },
}
