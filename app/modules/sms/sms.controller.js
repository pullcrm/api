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
