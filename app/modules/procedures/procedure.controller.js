import ProceduresService from './procedure.service'
import validate from "../../utils/validate"
import joi from "joi"

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        offset: +req.query.offset || 0,
        limit: +req.query.limit || 20,
        companyId: req.companyId
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
        companyId: joi.number()
      }))

      const roles = await ProceduresService.findAll(formattedData)
      res.send(roles)
    } catch (error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        name: req.body.name,
        price: req.body.price,
        duration: req.body.duration,
        companyId: req.companyId
      }

      validate(formattedData, joi.object().keys({
        name: joi.string().required(),
        price: joi.number().required(),
        duration: joi.number().required(),
        companyId: joi.number().required()
      }))

      const roles = await ProceduresService.create(formattedData)
      res.send(roles)
    } catch (error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const formattedData = {
        name: req.body.name,
        price: req.body.price,
        duration: req.body.duration,
      }

      const params = {
        procedureId: req.params.id,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        name: joi.string(),
        price: joi.number(),
        duration: joi.number(),
        procedureId: joi.number().required(),
        companyId: joi.number().required()
      }))

      const roles = await ProceduresService.update(formattedData, params)
      res.send(roles)
    } catch (error) {
      next(error)
    }
  },

  destroy: async (req, res, next) => {
    try {
      const params = {
        procedureId: req.params.id,
        companyId: req.companyId
      }

      validate(params, joi.object().keys({
        procedureId: joi.number().required(),
        companyId: joi.number().required()
      }))

      res.send(await ProceduresService.destroy(params))
    } catch (error) {
      next(error)
    }
  },
}
