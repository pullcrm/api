import joi from "joi"
import 'dotenv/config'
import validate from "../../utils/validate"
import CompanyService from './company.service'
import UserService from '../users/user.service'
import ApproachService from '../approaches/approach.service'
import {mysql} from "../../config/connections"
import {ALL, HIDE, DASHBOARD} from '../../constants/employees'

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

      await ApproachService.checkBy(formattedData)
      const company = await CompanyService.findBy({id: formattedData.companyId, userId: formattedData.userId})
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

  addSMSConfiguration: async (req, res, next) => {
    try {
      const formattedData = {
        token: req.body.token,
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        token: joi.string().required(),
        companyId: joi.number().required(),
        userId: joi.number().required(),
      }))

      const company = await CompanyService.addSMSConfiguration(formattedData, params)

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

  findStaff: async (req, res, next) => {
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

      const users = await CompanyService.findStaff(formattedData)
      res.send(users)
    } catch (error) {
      next(error)
    }
  },

  addEmployee: async (req, res, next) => {
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
        await CompanyService.addEmployee(user, params, transaction)

        return user
      })

      res.send(result)
    } catch (error) {
      next(error)
    }
  },

  //TODO only admin can update his employers
  updateEmployee: async (req, res, next) => {
    try {
      const formattedData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatarId: req.body.avatarId,
      }

      const params = {
        companyId: req.companyId,
        userId: req.params.id
      }

      validate({...formattedData, ...params}, joi.object().keys({
        companyId: joi.number().required(),
        userId: joi.number().required(),
        firstName: joi.string(),
        lastName: joi.string(),
        avatarId: joi.number(),
      }))

      const users = await UserService.update(formattedData, params)
      res.send(users)
    } catch (error) {
      next(error)
    }
  },

  updateEmployeeStatus: async (req, res, next) => {
    try {
      const formattedData = {
        status: req.body.status,
      }

      const params = {
        companyId: req.companyId,
        employeeId: req.params.id
      }

      validate({...formattedData, ...params}, joi.object().keys({
        companyId: joi.number().required(),
        employeeId: joi.number().required(),
        status: joi.string().valid(ALL, HIDE, DASHBOARD).required()
      }))

      const employee = await ApproachService.updateStatus(formattedData, params)
      res.send(employee)
    } catch (error) {
      next(error)
    }
  },
  
}

