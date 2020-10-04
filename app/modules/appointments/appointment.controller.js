import AppointmentService from './appointment.service'
import validate from "../../utils/validate"
import joi from "joi"

import {WORKING_HOURS_SLOTS} from '../../constants/times'
import {IN_PROGRESS, COMPLETED, CANCELED} from '../../constants/appointments'

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

      const params = {
        userId: req.userId
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

      const slots = {...WORKING_HOURS_SLOTS}

      appointments.forEach(({startTime, procedures}) => {
        const duration = procedures.reduce((result, procedure) => {
          return result + procedure.duration
        }, 0)

        const slotCount = duration / 15
        const startIndex = Object.keys(slots).indexOf(startTime.slice(0, 5))
        
        for (let index = 0; index < slotCount; index++) {
          const key = Object.keys(slots)[startIndex + index]

          slots[key] = true
        }
      })

      res.send(slots)
    } catch(error) {
      next(error)
    }
  }
}
