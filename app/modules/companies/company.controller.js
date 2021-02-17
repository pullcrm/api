import joi from "joi"
import 'dotenv/config'
import validate from "../../utils/validate"
import CompanyService from './company.service'
import UserService from '../users/user.service'
import SpecialistService from '../specialists/specialist.service'
import {mysql} from "../../config/connections"
import {ALL, HIDE, DASHBOARD} from '../../constants/specialists'

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
        categoryId: req.body.categoryId,
        logoId: req.body.logoId,
        userId: req.userId
      }

      validate(formattedData, joi.object().keys({
        name: joi.string().required(),
        cityId: joi.number().required(),
        categoryId: joi.number().required(),
        logoId: joi.number().optional(),
        userId: joi.number().required()
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
        categoryId: req.body.categoryId,
        logoId: req.body.logoId,
      }

      const params = {
        userId: req.userId,
        companyId: +req.params.id
      }

      validate({...formattedData, ...params}, joi.object().keys({
        name: joi.string(),
        cityId: joi.number(),
        categoryId: joi.number(),
        logoId: joi.number(),
        companyId: joi.number().required(),
        userId: joi.number().required(),
      }))

      const company = await CompanyService.update(formattedData, params)

      res.send(company)
    } catch (error) {
      next(error)
    }
  },

  findSpecialists: async (req, res, next) => {
    try {
      const formattedData = {
        offset: +req.query.offset || 0,
        limit: +req.query.limit || 20,
        companyId: req.companyId,
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
        companyId: joi.number().required(),
      }))

      const users = await CompanyService.findSpecialists(formattedData)
      res.send(users)
    } catch (error) {
      next(error)
    }
  },

  addSpecialist: async (req, res, next) => {
    try {
      const formattedData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        avatarId: req.body.avatarId,
        code: req.body.code,
      }

      const params = {
        companyId: req.companyId,
      }

      validate({...formattedData, ...params}, joi.object().keys({
        companyId: joi.number().required(),
        code: joi.string().max(4).required(),
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        phone: joi.string().required(),
        avatarId: joi.number().optional()
      }))

      const result = await mysql.transaction(async transaction => {
        const user = await UserService.create(formattedData, params, transaction)
        await CompanyService.addSpecialist(user, params, transaction)

        return user
      })

      res.send(result)
    } catch (error) {
      next(error)
    }
  },

  //TODO only admin can update his employers
  updateSpecialist: async (req, res, next) => {
    try {
      const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatarId: req.body.avatarId,
      }

      const specialistData = {
        description: req.body.description,
        status: req.body.status,
        specialization: req.body.specialization
      }

      const params = {
        companyId: req.companyId,
        userId: req.params.id
      }

      validate({...userData, ...specialistData, ...params}, joi.object().keys({
        companyId: joi.number().required(),
        userId: joi.number().required(),
        firstName: joi.string(),
        lastName: joi.string(),
        avatarId: joi.number(),
        description: joi.string().allow(''),
        specialization: joi.string().allow(''),
        status: joi.string().valid(ALL, HIDE, DASHBOARD),
      }))

      const user = await UserService.update(userData, params)
      const specialist = await SpecialistService.update(specialistData, params)

      res.send({...user.toJSON(), ...specialist.toJSON()})
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
        remindSMSMinutes: req.body.remindSMSMinutes
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
        remindSMSMinutes: req.body.remindSMSMinutes
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

