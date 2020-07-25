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
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
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
        date: joi.date().timestamp(),
        total: joi.number(),
        description: joi.string()
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
        name: req.body.name,
        price: req.body.price,
        duration: req.body.duration,
      }

      const params = {
        procedureId: req.params.id,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        name: joi.string(),
        price: joi.number(),
        duration: joi.number(),
        procedureId: joi.number().required(),
        companyId: joi.number().required()
      }))

      // const roles = await ProceduresService.update(formattedData, params)
      // res.send(roles)
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
