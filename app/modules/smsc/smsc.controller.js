import validate from "../../utils/validate"
import joi from "joi"

import SMS from '../../providers/smsc'

export default {
  balance: async (req, res, next) => {
    try {
      const params = {
        login: req.body.login,
        psw: req.body.password
      }

      validate(params, joi.object().keys({
        login: joi.string(),
        psw: joi.string()
      }))

      const result = await SMS.getBalance(params)

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

      const result = await SMS.removeSms(params)

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

      const result = await SMS.sendSms(params)

      res.send(result)
    } catch (error) {
      next(error)
    }
  }
}
