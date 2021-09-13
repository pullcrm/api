import 'dotenv/config'

import joi from "../../utils/joi"
import validate from "../../utils/validate"
import CompanyService from './company.service'
import SpecialistService from '../specialists/specialist.service'

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        userId: req.userId
      }

      validate(formattedData, joi.object().keys({
        userId: joi.number()
      }))

      const companies = await CompanyService.findAll(formattedData)
      res.send(companies)
    } catch (error) {
      next(error)
    }
  },

  show: async (req, res, next) => {
    try {
      const formattedData = {
        userId: req.userId,
        companyId: req.params.id
      }

      validate(formattedData, joi.object().keys({
        userId: joi.number(),
        companyId: joi.number()
      }))

      await SpecialistService.checkBy(formattedData)
      const company = await CompanyService.findOne({id: formattedData.companyId, userId: formattedData.userId})
      res.send(company)
    } catch (error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        name: req.body.name,
        cityId: req.body.cityId,
        typeId: req.body.typeId,
        logoId: req.body.logoId,
        userId: req.userId,
        address: req.body.address,
        phone: req.body.phone,
        description: req.body.description,
        viber: req.body.viber,
        telegram: req.body.telegram,
        instagram: req.body.instagram,
        facebook: req.body.facebook
      }

      validate(formattedData, joi.object().keys({
        name: joi.string().required().max(255),
        cityId: joi.number().required(),
        typeId: joi.number().required(),
        logoId: joi.number().optional(),
        userId: joi.number().required(),
        address: joi.string().allow('').max(255),
        phone: joi.string().allow('').pattern(/^0\d+$/).length(10),
        description: joi.string().allow('').max(255),
        viber: joi.string().allow('').max(255),
        telegram: joi.string().allow('').max(255),
        instagram: joi.string().allow('').max(255),
        facebook: joi.string().allow('').max(255),
      }))

      const company = await CompanyService.create(formattedData)

      res.send(company)
    } catch (error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const formattedData = {
        name: req.body.name,
        cityId: req.body.cityId,
        typeId: req.body.typeId,
        logoId: req.body.logoId,
        address: req.body.address,
        phone: req.body.phone,
        description: req.body.description,
        viber: req.body.viber,
        telegram: req.body.telegram,
        instagram: req.body.instagram,
        facebook: req.body.facebook
      }

      const params = {
        userId: req.userId,
        companyId: +req.params.id
      }

      validate({...formattedData, ...params}, joi.object().keys({
        name: joi.string().max(255),
        cityId: joi.number(),
        typeId: joi.number(),
        logoId: joi.number(),
        companyId: joi.number().required(),
        userId: joi.number().required(),
        address: joi.string().allow('').max(255),
        phone: joi.string().allow('').pattern(/^0\d+$/).length(10),
        description: joi.string().allow('').max(255),
        viber: joi.string().allow('').max(255),
        telegram: joi.string().allow('').max(255),
        instagram: joi.string().allow('').max(255),
        facebook: joi.string().allow('').max(255),
      }))

      const company = await CompanyService.update(formattedData, params)

      res.send(company)
    } catch (error) {
      next(error)
    }
  },

  publicGetCompany: async (req, res, next) => {
    try {
      const formattedData = {
        companyId: req.params.id
      }

      validate(formattedData, joi.object().keys({
        companyId: joi.number()
      }))

      const company = await CompanyService.findOne({id: formattedData.companyId})
      res.send(company)
    } catch (error) {
      next(error)
    }
  },

  getStats: async (req, res, next) => {
    try {
      const formattedData = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...params}, joi.object().keys({
        userId: joi.number().required(),
        companyId: joi.number().required(),
        startDate: joi.string(),
        endDate: joi.string(),
      }))

      const stats = await CompanyService.getStats(formattedData, params)

      res.send(stats)

    } catch (error) {
      next(error)
    }
  },

  getTypes: async (req, res, next) => {
    try {
      const types = await CompanyService.getTypes()
      res.send(types)

    } catch (error) {
      next(error)
    }
  },
}

