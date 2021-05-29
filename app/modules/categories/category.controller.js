import CategoryService from './category.service'
import validate from "../../utils/validate"
import joi from "joi"
import {PROCEDURE} from '../../constants/categories'

export default {
  create: async (req, res, next) => {
    try {
      const formattedData = {
        name: req.body.name,
        companyId: req.companyId,
        type: req.body.type
      }

      validate(formattedData, joi.object().keys({
        name: joi.string().required(),
        companyId: joi.number().required(),
        type: joi.string().required().valid(PROCEDURE)
      }))

      const category = await CategoryService.create(formattedData)
      res.send(category)
    } catch (error) {
      next(error)
    }
  },

  index: async (req, res, next) => {
    try {
      const formattedData = {
        offset: +req.query.offset || 0,
        limit: +req.query.limit || 20,
        companyId: req.companyId,
        type: req.query.type || 'PROCEDURE'
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
        companyId: joi.number(),
        type: joi.string()
      }))

      const categories = await CategoryService.find(formattedData)
      res.send(categories)
    } catch (error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
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

      const category = await CategoryService.update(formattedData, params)
      res.send(category)
    } catch (error) {
      next(error)
    }
  },

  destroy: async (req, res, next) => {
    try {
      const params = {
        categoryId: req.params.id,
        companyId: req.companyId
      }

      validate(params, joi.object().keys({
        categoryId: joi.number().required(),
        companyId: joi.number().required()
      }))

      res.send(await CategoryService.destroy(params))
    } catch (error) {
      next(error)
    }
  },
}
