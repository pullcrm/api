import {IN_PROGRESS, COMPLETED, CANCELED, IN_QUEUE} from '../../constants/appointments'
import {getAvailableTime} from '../../logics/appointments'
import joi from "../../utils/joi"
import validate from '../../utils/validate'
import {getDayWorkTime} from '../../utils/time'
import ProcedureModel from '../procedures/models/procedure'
import TimeOffService from '../timeoff/timeoff.service'
import TimeWorkService from '../timework/timework.service'
import SMSGlobalService from '../sms/services/sms.global'
import AppointmentService from './appointment.service'
import {ADMIN_PANEL, WIDGET} from "../../constants/appointmentSources"
import NotificationService from "../notifications/notification.service"
import {isAppointmentEdited} from '../sms/sms.view'

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        date: req.query.date,
        status: req.query.status,
        companyId: req.companyId
      }

      const statusValidation = joi.string().valid(IN_PROGRESS, COMPLETED, CANCELED, IN_QUEUE)

      validate(formattedData, joi.object().keys({
        date: joi.string(),
        status: Array.isArray(formattedData.status) ? joi.array().items(statusValidation) : statusValidation,
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
        specialistId: req.body.specialistId,
        clientId: req.body.clientId,
        fullName: req.body.fullName,
        phone: req.body.phone,
        procedures: req.body.procedures,
        date: req.body.date,
        startTime: req.body.startTime,
        total: req.body.total,
        totalDuration: req.body.totalDuration,
        description: req.body.description,
        status: req.body.status,
        hasRemindSMS: req.body.hasRemindSMS,
        hasCreationSMS: req.body.hasCreationSMS,
        source: ADMIN_PANEL
      }

      const params = {
        companyId: req.companyId,
      }

      const dateValidation = joi.date().format('YYYY-MM-DD')
      const startTimeValidation = joi.string().regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/).allow(null)

      validate({...params, ...formattedData}, joi.object().keys({
        specialistId: joi.number(),
        clientId: joi.number(),
        fullName: joi.string().max(255),
        phone: joi.string().pattern(/^0\d+$/).length(10),
        companyId: joi.number().required(),
        procedures: joi.array().required(),
        date: formattedData.status === IN_QUEUE ? dateValidation : dateValidation.required(),
        startTime: formattedData.status === IN_QUEUE ? startTimeValidation : startTimeValidation.required(),
        totalDuration: joi.number(),
        total: joi.number(),
        description: joi.string().allow('').max(255),
        status: joi.string().valid(IN_PROGRESS, COMPLETED, CANCELED, IN_QUEUE),
        hasRemindSMS: joi.boolean(),
        hasCreationSMS: joi.boolean(),
        source: joi.string().valid(WIDGET, ADMIN_PANEL),
      }))

      let appointment

      if(formattedData.status !== IN_QUEUE) {
        await TimeOffService.checkForAvailableTime(formattedData)
        appointment = await AppointmentService.create(formattedData, params)
  
        SMSGlobalService.createAppointment(formattedData, {...params, appointmentId: appointment.id})
        NotificationService.createAppointment({...formattedData, appointmentId: appointment.id})
      }

      if(formattedData.status === IN_QUEUE) {
        appointment = await AppointmentService.create(formattedData, params)
      }

      res.send(appointment)
    } catch(error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const formattedData = {
        specialistId: req.body.specialistId,
        fullName: req.body.fullName,
        procedures: req.body.procedures,
        totalDuration: req.body.totalDuration,
        date: req.body.date,
        phone: req.body.phone,
        startTime: req.body.startTime,
        total: req.body.total,
        description: req.body.description,
        status: req.body.status,
        hasRemindSMS: req.body.hasRemindSMS,

      }

      const params = {
        appointmentId: req.params.id,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        specialistId: joi.number(),
        clientId: joi.number(),
        fullName: joi.string().max(255),
        phone: joi.string().pattern(/^0\d+$/).length(10),
        companyId: joi.number(),
        totalDuration: joi.number(),
        procedures: joi.array(),
        date: joi.date().format('YYYY-MM-DD'),
        startTime: joi.string().regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/).allow(null),
        total: joi.number(),
        description: joi.string().allow('').max(255),
        appointmentId: joi.number(),
        status: joi.string().valid(IN_PROGRESS, COMPLETED, CANCELED, IN_QUEUE),
        hasRemindSMS: joi.boolean().allow(null),
      }))

      let newAppointment

      if(formattedData.status !== IN_QUEUE) {
        await TimeOffService.checkForAvailableTime({...formattedData, ...params})
        const oldAppointment = await AppointmentService.find(params.appointmentId)
        newAppointment = await AppointmentService.update(formattedData, params)
  
        if(isAppointmentEdited(oldAppointment, newAppointment)) {
          await SMSGlobalService.destroySMS({smsIdentifier: oldAppointment.smsIdentifier})
          SMSGlobalService.createAppointment(formattedData, params)
          NotificationService.updateAppointment(formattedData, params.appointmentId)
        }
      }

      if(formattedData.status === IN_QUEUE) {
        newAppointment = await AppointmentService.update(formattedData, params)
      }

      res.send(newAppointment)
    } catch (error) {
      next(error)
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const formattedData = {
        status: req.body.status,
      }

      const params = {
        appointmentId: req.params.id,
        companyId: req.companyId,
      }

      validate({...formattedData, ...params}, joi.object().keys({
        appointmentId: joi.number(),
        companyId: joi.number().required(),
        status: joi.string().valid(IN_PROGRESS, COMPLETED, CANCELED, IN_QUEUE),
      }))

      const newAppointment = await AppointmentService.update(formattedData, params)

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

      await NotificationService.deleteAppointment(params.appointmentId)
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
        date: joi.date().format('YYYY-MM-DD').utc(),
        userId: joi.number().required(),
        companyId: joi.number().required(),
        excludeId: joi.number().allow(null),
        specialistId: joi.number().required(),
        duration: joi.number().required()
      }))

      const [timeOffs, appointments, timeWork] = await Promise.all([
        TimeOffService.findAll(formattedData),
        AppointmentService.fetchBySpecialistId(formattedData),
        TimeWorkService.getSpecialistTimeWork({...formattedData, startDate: formattedData.date})
      ])

      if (!timeWork.length) {
        res.send([])
      }

      const {from, to} = getDayWorkTime(timeWork[0])

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
        date: joi.date().format('YYYY-MM-DD'),
        companyId: joi.number().required(),
        specialistId: joi.number().required(),
        duration: joi.number().required()
      }))

      const [timeOffs, appointments, timeWork] = await Promise.all([
        TimeOffService.findAll(formattedData),
        AppointmentService.fetchBySpecialistId(formattedData),
        TimeWorkService.getSpecialistTimeWork({...formattedData, startDate: formattedData.date})
      ])

      if (!timeWork.length) {
        res.send([])
      }

      const {from, to} = getDayWorkTime(timeWork[0])

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
        procedures: req.body.procedures,
        totalDuration: req.body.totalDuration,
        date: req.body.date,
        startTime: req.body.startTime,
        total,
        description: req.body.description,
        source: WIDGET,
        status: IN_PROGRESS,
        hasRemindSMS: req.body.hasRemindSMS,
        hasCreationSMS: req.body.hasCreationSMS,
      }

      const params = {
        companyId: req.body.companyId,
      }

      validate({...formattedData, ...params}, joi.object().keys({
        specialistId: joi.number(),
        fullName: joi.string().max(255),
        phone: joi.string().pattern(/^0\d+$/).length(10),
        companyId: joi.number(),
        procedures: joi.array(),
        date: joi.date().format('YYYY-MM-DD').required(),
        startTime: joi.string().regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/).required(),
        totalDuration: joi.number(),
        total: joi.number(),
        description: joi.string().allow('').max(255),
        status: joi.string().valid(IN_PROGRESS),
        source: joi.string().valid(WIDGET),
        hasRemindSMS: joi.boolean(),
        hasCreationSMS: joi.boolean(),
      }))

      await TimeOffService.checkForAvailableTime(formattedData)
      const appointment = await AppointmentService.create(formattedData, params)

      SMSGlobalService.createAppointment(formattedData, {...params, appointmentId: appointment.id})
      NotificationService.createAppointment({...formattedData, appointmentId: appointment.id})

      res.send(appointment)
    } catch(error) {
      next(error)
    }
  }
}
