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

      const procedures = await ProceduresService.findAll(formattedData)
      res.send(procedures)
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
        companyId: req.companyId,
        description: req.body.description
      }

      validate(formattedData, joi.object().keys({
        name: joi.string().required(),
        price: joi.number().required(),
        duration: joi.number().required(),
        companyId: joi.number().required(),
        description: joi.string().allow('')
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
        description: req.body.description
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
        companyId: joi.number().required(),
        description: joi.string().allow(''),
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

  publicFindAllProcedures: async (req, res, next) => {
    try {
      const formattedData = {
        offset: +req.query.offset || 0,
        limit: +req.query.limit || 20,
        companyId: req.query.companyId
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
        companyId: joi.number()
      }))

      const procedures = await ProceduresService.findAll(formattedData)
      res.send(procedures)
    } catch (error) {
      next(error)
    }
  },

  createCategory: async (req, res, next) => {
    try {
      const formattedData = {
        name: req.body.name,
        companyId: req.companyId,
      }

      validate(formattedData, joi.object().keys({
        name: joi.string().required(),
        companyId: joi.number().required()
      }))

      const category = await ProceduresService.createCategory(formattedData)
      res.send(category)
    } catch (error) {
      next(error)
    }
  },

  getCategories: async (req, res, next) => {
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

      const categories = await ProceduresService.findCategories(formattedData)
      res.send(categories)
    } catch (error) {
      next(error)
    }
  },

  updateCategory: async (req, res, next) => {
    try {
      const formattedData = {
        name: req.body.name,
      }

      const params = {
        categoryId: req.params.id,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        name: joi.string(),
        categoryId: joi.number().required(),
        companyId: joi.number().required(),
      }))

      const category = await ProceduresService.updateCategory(formattedData, params)
      res.send(category)
    } catch (error) {
      next(error)
    }
  },

  destroyCategory: async (req, res, next) => {
    try {
      const params = {
        categoryId: req.params.id,
        companyId: req.companyId
      }

      validate(params, joi.object().keys({
        categoryId: joi.number().required(),
        companyId: joi.number().required()
      }))

      res.send(await ProceduresService.destroyCategory(params))
    } catch (error) {
      next(error)
    }
  },
}
