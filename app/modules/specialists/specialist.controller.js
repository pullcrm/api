import SpecialistService from './specialist.service'
import validate from "../../utils/validate"
import joi from "joi"
import {mysql} from '../../config/connections'
import UserService from '../users/user.service'
import {ALL, DASHBOARD, HIDE} from '../../constants/specialists'

export default {
  index: async (req, res, next) => {
    try {
      const params = {
        companyId: req.companyId,
        sort: req.query.sort || 'id',
        order: req.query.order || 'desc'
      }

      validate(params, joi.object().keys({
        companyId: joi.number().required(),
        sort: joi.string(),
        order: joi.string()
      }))

      const specialists = await SpecialistService.index(params)
      res.send(specialists)
    } catch(error) {
      next(error)
    }
  },

  publicIndex: async (req, res, next) => {
    try {
      const params = {
        companyId: req.query.companyId,
        sort: req.query.sort || 'id',
        order: req.query.order || 'desc'
      }

      validate(params, joi.object().keys({
        companyId: joi.number().required(),
        sort: joi.string(),
        order: joi.string()
      }))

      const specialists = await SpecialistService.publicIndex(params)
      res.send(specialists)
    } catch(error) {
      next(error)
    }
  },

  bulkUpdate: async (req, res, next) => {
    try {
      const formattedData = {
        specialists: req.body
      }

      //TODO add validation
      validate(formattedData, joi.object().keys({
        specialists: joi.array()
      }))

      const specialists = await SpecialistService.bulkUpdate(formattedData)
      res.send(specialists)
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
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
        const specialist = await SpecialistService.create(user, params, transaction)

        return {...specialist.toJSON(), user: user.toJSON()}
      })

      res.send(result)
    } catch (error) {
      next(error)
    }
  },

  //TODO only admin can update his employers
  update: async (req, res, next) => {
    try {
      const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatarId: req.body.avatarId,
        email: req.body.email,
      }

      const specialistData = {
        description: req.body.description,
        status: req.body.status,
        specialization: req.body.specialization
      }

      const params = {
        companyId: req.companyId,
        specialistId: req.params.id
      }

      validate({...userData, ...specialistData, ...params}, joi.object().keys({
        companyId: joi.number().required(),
        specialistId: joi.number().required(),
        firstName: joi.string(),
        lastName: joi.string(),
        avatarId: joi.number(),
        description: joi.string().allow(''),
        specialization: joi.string().allow(''),
        status: joi.string().valid(ALL, HIDE, DASHBOARD),
        email: joi.string().allow(''),
      }))

      const specialist = await SpecialistService.update(specialistData, params)
      const user = await UserService.update(userData, specialist.userId)

      res.send({...specialist.toJSON(), user: user.toJSON()})
    } catch (error) {
      next(error)
    }
  },

  destroy: async (req, res, next) => {
    try {
      const formattedData = {
        specialistId: req.params.id,
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        specialistId: joi.number().required(),
        userId: joi.number().required(),
        companyId: joi.number().required()
      }))

      await SpecialistService.destory(formattedData, params)

      res.send({message: 'OK'})
    } catch (error) {
      next(error)
    }
  },
}
