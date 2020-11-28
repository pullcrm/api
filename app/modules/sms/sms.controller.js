import validate from "../../utils/validate"
import joi from "joi"
import SMSPrivateService from './services/sms.private'

export default {
  addSMSConfiguration: async (req, res, next) => {
    try {
      const formattedData = {
        token: req.body.token,
        login: req.body.login,
        password: req.body.password
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        token: joi.string().required(),
        login: joi.string().required(),
        password: joi.string().required(),
        companyId: joi.number().required(),
        userId: joi.number().required(),
      }))

      const company = await SMSPrivateService.addSMSConfiguration(formattedData, params)

      res.send(company)
    } catch (error) {
      next(error)
    }
  },

  updateSMSConfiguration: async (req, res, next) => {
    try {
      const formattedData = {
        remindAfterCreation: req.body.remindAfterCreation,
        beforeTime: req.body.beforeTime,
        remindBeforeTime: req.body.remindBeforeTime
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        remindAfterCreation: joi.boolean(),
        remindBeforeTime: joi.boolean(),
        beforeTime: joi.number().when('remindBeforeTime', {is: true, then: joi.required()}),
        companyId: joi.number().required(),
        userId: joi.number().required(),
      }))

      const company = await SMSPrivateService.updateSMSConfiguration(formattedData, params)

      res.send(company)
    } catch (error) {
      next(error)
    }
  },

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

  removeSms: async (req, res, next) => {
    try {
      const params = {
        id: req.body.id,
        psw: req.body.password,
        login: req.body.login,
        phone: req.body.phone
      }

      validate(params, joi.object().keys({
        id: joi.string().required(),
        psw: joi.string().required(),
        login: joi.string().required(),
        phone: joi.string().required()
      }))

      const result = await SMSPrivateService.removeSms(params)

      res.send(result)
    } catch (error) {
      next(error)
    }
  },

  sendSms: async (req, res, next) => {
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

      const result = await SMSPrivateService.sendSms(params)

      res.send(result)
    } catch (error) {
      next(error)
    }
  }
}
