import validate from "../../utils/validate"
import joi from "../../utils/joi"
import SMSGlobalService from './services/sms.global'

export default {
  index: async (req, res, next) => {
    try {
      const params = {
        companyId: req.companyId,
        offset: +req.query.offset || 0,
        limit: +req.query.limit || 20,
      }

      validate(params, joi.object().keys({
        companyId: joi.number().required(),
        offset: joi.number(),
        limit: joi.number(),
      }))

      const smsHistory = await SMSGlobalService.findAll(params)

      res.send(smsHistory)
    } catch(error) {
      next(error)
    }
  },

  status: async (req, res, next) => {
    try {
      const formattedData = {
        phone: req.body.phone,
        smsIdentifier: req.body.smsIdentifier
      }

      const params = {
        companyId: req.companyId,
      }

      validate({...params, ...formattedData}, joi.object().keys({
        companyId: joi.number(),
        phone: joi.string(),
        smsIdentifier: joi.string()
      }))

      const result = await SMSGlobalService.status(formattedData)

      res.send(result)
    } catch (error) {
      next(error)
    }
  },

  addSettings: async (req, res, next) => {
    try {
      const formattedData = {
        hasCreationSMS: req.body.hasCreationSMS,
        hasRemindSMS: req.body.hasRemindSMS,
        remindSMSMinutes: req.body.remindSMSMinutes,
        creationSMSTemplate: req.body.creationSMSTemplate,
        remindSMSTemplate: req.body.remindSMSTemplate,
        // companyName: req.body.companyName
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        companyId: joi.number().required(),
        userId: joi.number().required(),
        hasCreationSMS: joi.boolean(),
        hasRemindSMS: joi.boolean(),
        remindSMSMinutes: joi.number().when('hasRemindSMS', {is: true, then: joi.required()}),
        creationSMSTemplate: joi.string().max(255),
        remindSMSTemplate: joi.string().max(255),
        // companyName: joi.string().regex(/^([^{|,;%'#%*!^=[\]()~<>}"]+)([a-zA-Z]+)+$/).max(11)
      }))

      const company = await SMSGlobalService.addSettings(formattedData, params)

      res.send(company)
    } catch (error) {
      next(error)
    }
  },

  updateSettings: async (req, res, next) => {
    try {
      const formattedData = {
        hasCreationSMS: req.body.hasCreationSMS,
        hasRemindSMS: req.body.hasRemindSMS,
        remindSMSMinutes: req.body.remindSMSMinutes,
        creationSMSTemplate: req.body.creationSMSTemplate,
        remindSMSTemplate: req.body.remindSMSTemplate,
        // companyName: req.body.companyName
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        userId: joi.number().required(),
        companyId: joi.number().required(),
        hasCreationSMS: joi.boolean(),
        hasRemindSMS: joi.boolean(),
        remindSMSMinutes: joi.number().when('hasRemindSMS', {is: true, then: joi.required()}),
        creationSMSTemplate: joi.string().max(255),
        remindSMSTemplate: joi.string().max(255),
        // companyName: joi.string().regex(/^([^{|,;%'#%*!^=[\]()~<>}"]+)([a-zA-Z]+)+$/).max(11)
      }))

      const company = await SMSGlobalService.updateSettings(formattedData, params)

      res.send(company)
    } catch (error) {
      next(error)
    }
  },

  deleteSettings: async (req, res, next) => {
    try {
      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...params}, joi.object().keys({
        userId: joi.number().required(),
        companyId: joi.number().required()
      }))

      await SMSGlobalService.deleteSettings(params)

      res.send({message: 'OK'})
    } catch (error) {
      next(error)
    }
  },

  handleStatus: async (req, res, next) => {
    try {
      if(req.body.total === 'test') {
        res.send({status: 'Active'})
      }

      const formattedData = {
        id: req.body.detail[0].id,
        status: req.body.detail[0].state.value,
        date: req.body.date
      }

      validate(formattedData, joi.object().keys({
        id: joi.number().required(),
        status: joi.string().required(),
        date: joi.string().required()
      }))

      const status = await SMSGlobalService.handleStatus(formattedData)

      res.send(status)
      
    } catch (error) {
      next(error)
    }
  }
}