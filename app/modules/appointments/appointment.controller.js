import joi from "joi"

import {IN_PROGRESS, COMPLETED, CANCELED} from '../../constants/appointments'
import {getAvailableTime} from '../../logics/appointments'
import validate from '../../utils/validate'
import {getDayWorkTime} from '../../utils/time'
import ProcedureModel from '../procedures/models/procedure'
import TimeOffService from '../timeoff/timeoff.service'
import TimeWorkService from '../timework/timework.service'
import SMSPrivateService from '../sms/services/sms.private'
import AppointmentService from './appointment.service'
import {ADMIN_PANEL, WIDGET} from "../../constants/appointmentSources"

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        date: req.query.date,
        companyId: req.companyId
      }

      validate(formattedData, joi.object().keys({
        date: joi.string().required(),
        companyId: joi.number().required()
      }))

      const appointments = await AppointmentService.findAll(formattedData)

      res.send(appointments)
    } catch(error) {
      next(error)
    }
  },

  queue: async (req, res, next) => {
    try {
      const formattedData = {
        companyId: req.companyId,
      }

      validate(formattedData, joi.object().keys({
        companyId: joi.number().required()
      }))

      const queue = await AppointmentService.queue(formattedData)

      res.send(queue)
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        specialistId: req.body.specialistId,
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
        hasRemindSMS: req.body.hasRemindSMS,
        hasCreationSMS: req.body.hasCreationSMS,
        source: ADMIN_PANEL
      }

      //TODO need to validate clientId, procedures for owner
      validate(formattedData, joi.object().keys({
        specialistId: joi.number(),
        clientId: joi.number(),
        fullName: joi.string(),
        phone: joi.string().pattern(/^0\d+$/).length(10),
        companyId: joi.number(),
        procedures: joi.array(),
        date: joi.date().required(),
        startTime: joi.string().regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/).allow(null),
        total: joi.number(),
        description: joi.string().allow(''),
        isQueue: joi.boolean().allow(null),
        status: joi.string().valid(IN_PROGRESS, COMPLETED, CANCELED),
        hasRemindSMS: joi.boolean(),
        hasCreationSMS: joi.boolean(),
        source: joi.string().valid(WIDGET, ADMIN_PANEL),
      }))

      await TimeOffService.checkForAvailableTime(formattedData)
      const appointment = await AppointmentService.create(formattedData)
      await SMSPrivateService.sendAfterAppointmentCreate({...formattedData, appointmentId: appointment.id})

      res.send(appointment)
    } catch(error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const formattedData = {
        specialistId: req.body.specialistId,
        clientId: req.body.clientId, // Not need to send
        fullName: req.body.fullName,
        phone: req.body.phone, // Not need to send
        companyId: req.companyId, // Not need to send
        procedures: req.body.procedures,
        date: req.body.date,
        startTime: req.body.startTime,
        total: req.body.total,
        description: req.body.description,
        isQueue: req.body.isQueue,
        status: req.body.status,
        hasRemindSMS: req.body.hasRemindSMS,
      }

      const params = {
        appointmentId: req.params.id,
      }

      validate({...formattedData, ...params}, joi.object().keys({
        specialistId: joi.number(),
        clientId: joi.number(),
        fullName: joi.string(),
        phone: joi.string().pattern(/^0\d+$/).length(10),
        companyId: joi.number(),
        procedures: joi.array(),
        date: joi.date(),
        startTime: joi.string().regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/).allow(null),
        total: joi.number(),
        description: joi.string().allow(''),
        appointmentId: joi.number(),
        isQueue: joi.boolean(),
        status: joi.string().valid(IN_PROGRESS, COMPLETED, CANCELED),
        hasRemindSMS: joi.boolean().allow(null),
      }))

      await TimeOffService.checkForAvailableTime({...formattedData, ...params})

      const smsIdentifier = await SMSPrivateService.sendAfterAppointmentUpdate(formattedData, params.appointmentId)
      const newAppointment = await AppointmentService.update({...formattedData, smsIdentifier}, params.appointmentId)

      res.send(newAppointment)
    } catch (error) {
      next(error)
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const formattedData = {
        status: req.body.status,
        companyId: req.companyId, // Not need to send
      }

      const params = {
        appointmentId: req.params.id,
      }

      validate({...formattedData, ...params}, joi.object().keys({
        appointmentId: joi.number(),
        companyId: joi.number().required(),
        status: joi.string().valid(IN_PROGRESS, COMPLETED, CANCELED),
      }))

      const newAppointment = await AppointmentService.update(formattedData, params.appointmentId)

      res.send(newAppointment)
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

      const result = await AppointmentService.destroy(params)

      res.send(result)
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

      const appointment = await AppointmentService.changeSMSIdentifier(data, params)

      res.send(appointment)
    } catch (error) {
      next(error)
    }
  },

  // TODO: Refactor
  availableTime: async (req, res, next) => {
    try {
      const formattedData = {
        date: req.body.date,
        userId: req.userId,
        companyId: req.companyId,
        excludeId: req.body.excludeId,
        specialistId: req.body.specialistId,
        duration: req.body.duration
      }

      validate(formattedData, joi.object().keys({
        date: joi.string(),
        userId: joi.number().required(),
        companyId: joi.number().required(),
        excludeId: joi.number().allow(null),
        specialistId: joi.number().required(),
        duration: joi.number().required()
      }))

      const [timeWork, timeOffs, appointments] = await Promise.all([
        TimeWorkService.findOne(formattedData),
        TimeOffService.findAll(formattedData),
        AppointmentService.fetchBySpecialistId(formattedData)
      ])

      const {from, to} = getDayWorkTime(formattedData.date, timeWork)

      const availableTime = getAvailableTime({
        from,
        to,
        duration: formattedData.duration,
        timeOffs,
        appointments,
      })

      res.send(availableTime)
    } catch(error) {
      next(error)
    }
  },

  publicAvailableTime: async (req, res, next) => {
    try {
      const formattedData = {
        date: req.body.date,
        companyId: req.body.companyId,
        specialistId: req.body.specialistId,
        duration: req.body.duration
      }

      validate(formattedData, joi.object().keys({
        date: joi.string(),
        companyId: joi.number().required(),
        specialistId: joi.number().required(),
        duration: joi.number().required()
      }))

      const [timeWork, timeOffs, appointments] = await Promise.all([
        TimeWorkService.findOne(formattedData),
        TimeOffService.findAll(formattedData),
        AppointmentService.fetchBySpecialistId(formattedData)
      ])

      const {opened, from, to} = getDayWorkTime(formattedData.date, timeWork)

      if (opened === false) {
        return res.send([])
      }

      const availableTime = getAvailableTime({
        from,
        to,
        duration: formattedData.duration,
        timeOffs,
        appointments,
      })

      return res.send(availableTime)
    } catch(error) {
      next(error)
    }
  },

  publicCreation: async (req, res, next) => {
    try {
      const procedures = await ProcedureModel.findAll({where: {id: req.body.procedures}, raw: true})
      const total = procedures.reduce((sum, procedure) => sum + Number(procedure.price), 0)

      const formattedData = {
        specialistId: req.body.specialistId,
        fullName: req.body.fullName,
        phone: req.body.phone,
        companyId: req.body.companyId,
        procedures: req.body.procedures,
        date: req.body.date,
        startTime: req.body.startTime,
        total,
        description: req.body.description,
        source: WIDGET,
        status: IN_PROGRESS,
        isQueue: false,
        hasRemindSMS: req.body.hasRemindSMS,
        hasCreationSMS: req.body.hasCreationSMS,
      }

      validate(formattedData, joi.object().keys({
        specialistId: joi.number(),
        fullName: joi.string(),
        phone: joi.string().pattern(/^0\d+$/).length(10),
        companyId: joi.number(),
        procedures: joi.array(),
        date: joi.date(),
        startTime: joi.string().regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/),
        total: joi.number(),
        description: joi.string().allow(''),
        isQueue: joi.boolean(),
        status: joi.string().valid(IN_PROGRESS, COMPLETED, CANCELED),
        source: joi.string().valid(WIDGET, ADMIN_PANEL),
        hasRemindSMS: joi.boolean(),
        hasCreationSMS: joi.boolean(),
      }))

      await TimeOffService.checkForAvailableTime(formattedData)
      const appointment = await AppointmentService.create(formattedData)
      await SMSPrivateService.sendAfterAppointmentCreate({...formattedData, appointmentId: appointment.id})

      res.send(appointment)
    } catch(error) {
      next(error)
    }
  }
}
