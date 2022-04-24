import ClientService from './client.service'
import validate from "../../utils/validate"
import joi from "../../utils/joi"

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
        offset: joi.number().required(),
        limit: joi.number().required(),
      }))

      const clients = await ClientService.index(params)
      res.send(clients)
    } catch(error) {
      next(error)
    }
  },

  findByPhoneOrName: async (req, res, next) => {
    try {
      const params = {
        companyId: req.companyId,
        offset: +req.query.offset || 0,
        limit: +req.query.limit || 20,
        phone: req.query.phone,
        fullName: req.query.fullName,
      }

      validate(params, joi.object().keys({
        companyId: joi.number().required(),
        offset: joi.number().required(),
        limit: joi.number().required(),
        phone: joi.string(),
        fullName: joi.string(),
      }))

      const clients = await ClientService.findByPhoneOrName(params)
      res.send(clients)
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        email: req.body.email,
        birthday: req.body.birthday
      }

      const params = {
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        companyId: joi.number().required(),
        fullName: joi.string().max(255).required(),
        phone: joi.string().pattern(/^0\d+$/).length(10),
        email: joi.string().email({tlds: {allow: false}}),
        birthday: joi.date().format('YYYY-MM-DD')
      }))

      const role = await ClientService.create(formattedData, params)
      res.send(role)
    } catch(error) {
      next(error)
    }
  }
}
