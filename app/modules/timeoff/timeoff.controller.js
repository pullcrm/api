import joi from "joi"
import TimeOffService from './timeoff.service'
import validate from "../../utils/validate"

export default {
  index: async (req, res, next) => {
    try {
      const params = {
        date: req.query.date,
        specialistId: req.query.specialistId,
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
        specialistId: req.body.specialistId,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime,
        description: req.body.description
      }

      const params = {
        userId: req.userId
      }

      validate({...formattedData,  ...params}, joi.object().keys({
        specialistId: joi.number().required(),
        startDateTime: joi.extend(require('@joi/date')).date().format('YYYY-MM-DD HH:mm:ss').required(),
        endDateTime:  joi.extend(require('@joi/date')).date().format('YYYY-MM-DD HH:mm:ss').required(),
        userId: joi.number().required(),
        description: joi.string().max(255).allow('')
      }))

      const timeoff = await TimeOffService.create({...formattedData,  ...params})
      res.send(timeoff)
    } catch(error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const formattedData = {
        specialistId: req.body.specialistId,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime,
        description: req.body.description
      }

      const params = {
        timeOffId: req.params.id,
        userId: req.userId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        specialistId: joi.number().required(),
        startDateTime: joi.extend(require('@joi/date')).date().format('YYYY-MM-DD HH:mm:ss').required(),
        endDateTime: joi.extend(require('@joi/date')).date().format('YYYY-MM-DD HH:mm:ss').required(),
        timeOffId: joi.number().required(),
        userId: joi.number().required(),
        description: joi.string().allow('')
      }))

      const roles = await TimeOffService.update(formattedData, params)
      res.send(roles)
    } catch (error) {
      next(error)
    }
  },

  destroy: async (req, res, next) => {
    try {
      const params = {
        timeOffId: req.params.id
      }

      validate(params, joi.object().keys({
        timeOffId: joi.number().required()
      }))

      res.send(await TimeOffService.destroy(params))
    } catch (error) {
      next(error)
    }
  },
}
