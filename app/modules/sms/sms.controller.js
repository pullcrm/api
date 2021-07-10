import validate from "../../utils/validate"
import joi from "joi"
import SMSPrivateService from './services/sms.private'

export default {
  balance: async (req, res, next) => {
    try {
      const params = {
        companyId: req.companyId,
      }

      validate(params, joi.object().keys({
        companyId: joi.number(),
      }))

      const result = await SMSPrivateService.balance(params)

      res.send(result)
    } catch (error) {
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

      const result = await SMSPrivateService.status(formattedData, params.companyId)

      res.send(result)
    } catch (error) {
      next(error)
    }
  },

  send: async (req, res, next) => {
    try {
      const params = {
        id: req.body.id,
        mes: req.body.message,
        psw: req.body.password,
        time: req.body.time,
        login: req.body.login,
        phones: req.body.phone,
      }

      validate(params, joi.object().keys({
        id: joi.string().required(),
        mes: joi.string().required(),
        psw: joi.string().required(),
        time: joi.string().required(),
        login: joi.string().required(),
        phones: joi.string().required()
      }))

      const result = await SMSPrivateService.send(params)

      res.send(result)
    } catch (error) {
      next(error)
    }
  },

  addSettings: async (req, res, next) => {
    try {
      const formattedData = {
        login: req.body.login,
        password: req.body.password,
        hasCreationSMS: req.body.hasCreationSMS,
        hasRemindSMS: req.body.hasRemindSMS,
        remindSMSMinutes: req.body.remindSMSMinutes,
        creationSMSTemplate: req.body.creationSMSTemplate,
        remindSMSTemplate: req.body.remindSMSTemplate
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        login: joi.string().required(),
        password: joi.string().required(),
        companyId: joi.number().required(),
        userId: joi.number().required(),
        hasCreationSMS: joi.boolean(),
        hasRemindSMS: joi.boolean(),
        remindSMSMinutes: joi.number().when('hasRemindSMS', {is: true, then: joi.required()}),
        creationSMSTemplate: joi.string(),
        remindSMSTemplate: joi.string()
      }))

      const company = await SMSPrivateService.addSettings(formattedData, params)

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
        creationSMSTemplate: joi.string(),
        remindSMSTemplate: joi.string()
      }))

      const company = await SMSPrivateService.updateSettings(formattedData, params)

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

      await SMSPrivateService.deleteSettings(params)

      res.send({message: 'OK'})
    } catch (error) {
      next(error)
    }
  },
}
