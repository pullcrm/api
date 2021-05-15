import joi from "joi"
import 'dotenv/config'
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
        name: joi.string().required(),
        cityId: joi.number().required(),
        typeId: joi.number().required(),
        logoId: joi.number().optional(),
        userId: joi.number().required(),
        address: joi.string(),
        phone: joi.string(),
        description: joi.string(),
        viber: joi.string(),
        telegram: joi.string(),
        instagram: joi.string(),
        facebook: joi.string()
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
        name: joi.string(),
        cityId: joi.number(),
        typeId: joi.number(),
        logoId: joi.number(),
        companyId: joi.number().required(),
        userId: joi.number().required(),
        address: joi.string(),
        phone: joi.string(),
        description: joi.string(),
        viber: joi.string(),
        telegram: joi.string(),
        instagram: joi.string(),
        facebook: joi.string()
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

      const company = await CompanyService.addSettings(formattedData, params)

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

      const company = await CompanyService.updateSettings(formattedData, params)

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

      await CompanyService.deleteSettings(params)

      res.send({message: 'OK'})
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
}

