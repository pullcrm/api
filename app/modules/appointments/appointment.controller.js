import AppointmentService from './appointment.service'
import validate from "../../utils/validate"
import joi from "joi"

import {getHoursSlots} from '../../logics/appointments'

import {IN_PROGRESS, COMPLETED, CANCELED} from '../../constants/appointments'
import ProcedureModel from '../procedures/procedure.model'
import TimeOffService from '../timeoff/timeoff.service'

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

      const [appointments, queue] = await Promise.all([
        AppointmentService.findAll(formattedData),
        AppointmentService.findAll({
          ...formattedData,
          isQueue: true
        })
      ])

      res.send({
        queue,
        appointments
      })
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        employeeId: req.body.employeeId,
        clientId: req.body.clientId,
        fullName: req.body.fullName,
        phone: req.body.phone,
        companyId: req.companyId,
        procedures: req.body.procedures,
        date: req.body.date,
        startTime: req.body.startTime,
        total: req.body.total,
        description: req.body.description,
        isQueue: req.body.isQueue,
        status: req.body.status,
      }

      //TODO need to validate clientId, procedures for owner
      validate(formattedData, joi.object().keys({
        employeeId: joi.number(),
        clientId: joi.number(),
        fullName: joi.string(),
        phone: joi.string(),
        companyId: joi.number(),
        procedures: joi.array(),
        date: joi.date(),
        startTime: joi.string().regex(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/).allow(null),
        total: joi.number(),
        description: joi.string().allow(''),
        isQueue: joi.boolean().allow(null),
        status: joi.string().valid(IN_PROGRESS, COMPLETED, CANCELED),
      }))

      await TimeOffService.checkTime(formattedData)
      const appointment = await AppointmentService.create(formattedData)
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
        fullName: req.body.fullName,
        phone: req.body.phone,
        companyId: req.companyId,
        procedures: req.body.procedures,
        date: req.body.date,
        startTime: req.body.startTime,
        total: req.body.total,
        description: req.body.description,
        isQueue: req.body.isQueue,
        status: req.body.status,
      }

      const params = {
        appointmentId: req.params.id,
      }

      validate({...formattedData, ...params}, joi.object().keys({
        employeeId: joi.number(),
        clientId: joi.number(),
        fullName: joi.string(),
        phone: joi.string(),
        companyId: joi.number(),
        procedures: joi.array(),
        date: joi.date(),
        startTime: joi.string().regex(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/).allow(null),
        total: joi.number(),
        description: joi.string().allow(''),
        appointmentId: joi.number(),
        isQueue: joi.boolean(),
        status: joi.string().valid(IN_PROGRESS, COMPLETED, CANCELED),
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

  changeSMSIdentifier: async (req, res, next) => {
    try {
      const data = {
        smsIdentifier: req.body.smsIdentifier,
      }

      const params = {
        appointmentId: req.params.id,
        companyId: req.companyId
      }

      validate({...data, ...params}, joi.object().keys({
        smsIdentifier: joi.string().allow(null),
        appointmentId: joi.number().required(),
        companyId: joi.number().required()
      }))

      res.send(await AppointmentService.changeSMSIdentifier(data, params))
    } catch (error) {
      next(error)
    }
  },

  // TODO: Need code review
  hoursSlots: async (req, res, next) => {
    try {
      const formattedData = {
        date: req.body.date,
        userId: req.userId,
        companyId: req.companyId,
        excludeId: req.body.excludeId,
        employeeId: req.body.employeeId
      }

      validate(formattedData, joi.object().keys({
        date: joi.string(),
        userId: joi.number().required(),
        companyId: joi.number().required(),
        excludeId: joi.number().allow(null),
        employeeId: joi.number().required()
      }))

      const appointments = await AppointmentService.fetchHoursSlots(formattedData)

      const slots = getHoursSlots(appointments)

      res.send(slots)
    } catch(error) {
      next(error)
    }
  },

  publicHoursSlots: async (req, res, next) => {
    try {
      const formattedData = {
        date: req.body.date,
        companyId: req.body.companyId,
        employeeId: req.body.employeeId
      }

      validate(formattedData, joi.object().keys({
        date: joi.string(),
        companyId: joi.number().required(),
        employeeId: joi.number().required()
      }))

      const appointments = await AppointmentService.fetchHoursSlots(formattedData)

      const slots = getHoursSlots(appointments)

      res.send(slots)
    } catch(error) {
      next(error)
    }
  },

  publicCreation: async (req, res, next) => {
    try {
      const procedures = Array.isArray(req.body.procedures) && await ProcedureModel.findAll({where: {id: req.body.procedures}, raw: true})
      const total = procedures.reduce((sum, procedure) => sum + Number(procedure.price), 0)

      const formattedData = {
        employeeId: req.body.employeeId,
        fullName: req.body.fullName,
        phone: req.body.phone,
        companyId: req.body.companyId,
        procedures: req.body.procedures,
        date: req.body.date,
        startTime: req.body.startTime,
        total,
        description: req.body.description,
        status: IN_PROGRESS,
        isQueue: false
      }

      validate(formattedData, joi.object().keys({
        employeeId: joi.number(),
        fullName: joi.string(),
        phone: joi.string().length(10),
        companyId: joi.number(),
        procedures: joi.array(),
        date: joi.date(),
        startTime: joi.string().regex(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/),
        total: joi.number(),
        description: joi.string().allow(''),
        isQueue: joi.boolean().allow(null),
        status: joi.string().valid(IN_PROGRESS, COMPLETED, CANCELED),
      }))

      const appointment = await AppointmentService.create(formattedData)
      res.send(appointment)
    } catch(error) {
      next(error)
    }
  }
}
