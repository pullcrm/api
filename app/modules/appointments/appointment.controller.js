import AppointmentService from './appointment.service'
import validate from "../../utils/validate"
import joi from "joi"

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        companyId: req.companyId,
        userId: req.userId,
        offset: req.query.offset,
        limit: req.query.limit,
        date: req.query.date,
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
        date: joi.string(),
        userId: joi.number().required(),
        companyId: joi.number().required()
      }))

      const appointments = await AppointmentService.findAll(formattedData)
      res.send(appointments)
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        employeeId: req.body.employeeId,
        clientId: req.body.clientId,
        fullname: req.body.fullname,
        phone: req.body.phone,
        companyId: req.companyId,
        procedures: req.body.procedures,
        date: req.body.date,
        total: req.body.total,
        description: req.body.description
      }

      const params = {
        userId: req.userId
      }

      //TODO need to validate clientId, procedures for owner
      validate(formattedData, joi.object().keys({
        employeeId: joi.number(),
        clientId: joi.number(),
        fullname: joi.string(),
        phone: joi.string(),
        companyId: joi.number(),
        procedures: joi.array(),
        date: joi.date(),
        total: joi.number(),
        description: joi.string().allow('')
      }))

      const appointment = await AppointmentService.create(formattedData, params)
      res.send(appointment)
    } catch(error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const formattedData = {
        employeeId: req.body.employeeId,
        clientId: req.body.clientId,
        fullname: req.body.fullname,
        phone: req.body.phone,
        companyId: req.companyId,
        procedures: req.body.procedures,
        date: req.body.date,
        total: req.body.total,
        description: req.body.description
      }

      const params = {
        appointmentId: req.params.id,
      }

      validate({...formattedData, ...params}, joi.object().keys({
        employeeId: joi.number(),
        clientId: joi.number(),
        fullname: joi.string(),
        phone: joi.string(),
        companyId: joi.number(),
        procedures: joi.array(),
        date: joi.date(),
        total: joi.number(),
        description: joi.string(),
        appointmentId: joi.number(),
      }))

      const appointment = await AppointmentService.update(formattedData, params)
      res.send(appointment)
    } catch (error) {
      next(error)
    }
  },

  destroy: async (req, res, next) => {
    try {
      const params = {
        appointmentId: req.params.id,
        companyId: req.companyId
      }

      validate(params, joi.object().keys({
        appointmentId: joi.number().required(),
        companyId: joi.number().required()
      }))

      res.send(await AppointmentService.destroy(params))
    } catch (error) {
      next(error)
    }
  },
}
