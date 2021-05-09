import sequelize from 'sequelize'
import {mysql} from '../../config/connections'
import CompanyModel from './models/company'
import SpecialistModel from "../specialists/specialist.model"
import RoleModel from "../roles/role.model"
import CityModel from "../cities/city.model"
import TypeModel from "./models/types"
import ApiException from "../../exceptions/api"
import FileModel from '../files/file.model'
import CompanySettingsModel from '../companies/models/settings'
import {privateSMS} from '../../providers/smsc'
import {encrypt} from '../../utils/crypto'
import AppointmentModel from '../appointments/appointment.model'
import {addDayToDate} from '../../utils/time'
import exclude from '../../utils/exclude'
import {COMPLETED} from '../../constants/appointments'
import TimeWorkModel from '../timework/timework.model'

export default {
  findOne: async params => {
    const company = await CompanyModel.findOne({where: params, attributes: {exclude: ['categoryId', 'userId', 'cityId', 'logoId']},
      include: [
        {model: TypeModel},
        {model: CityModel},
        {model: CompanySettingsModel},
        {model: FileModel, as: 'logo'}
      ]})

    if(!company) {
      throw new ApiException(404, 'Company was not found')
    }

    return company
    
  },

  findAll: async params => {
    return CompanyModel.findAll({where: {userId: params.userId}})
  },

  create: async data => {
    const result = await mysql.transaction(async transaction => {
      const company = await CompanyModel.create(data, {include: [{model: CityModel}, {model: TypeModel}], transaction})
      const adminRole = await RoleModel.findOne({where: {name: 'ADMIN'}, raw: true, transaction})
      await SpecialistModel.create({userId: company.userId, companyId: company.id, roleId: adminRole.id}, {transaction})
      await TimeWorkModel.create({companyId: company.id}, {transaction})
      return company
    })

    return result
  },

  update: async (data, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(!company) {
      throw new ApiException(404, 'Company wasn\'t found')
    }

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'That is not your company')
    }

    const result = await mysql.transaction(async transaction => {
      await company.update(data, {plain: true, transaction})

      return company
    })

    return result
  },

  addSettings: async (data, {companyId, userId}) => {
    const SMS = privateSMS({
      login: data.login,
      password: data.password
    })

    const result = await SMS.getBalance()

    if (JSON.parse(result).error) {
      throw new ApiException(404, 'SMS account wasn\'t found')
    }

    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    const smsToken = Buffer.from(JSON.stringify({
      login: data.login,
      password: encrypt(data.password)
    })).toString('hex')

    const setting = await CompanySettingsModel.create({
      hasRemindSMS: data.hasRemindSMS,
      remindSMSMinutes: data.remindSMSMinutes,
      hasCreationSMS: data.hasCreationSMS,
      smsToken: smsToken,
      companyId
    })

    return exclude(setting, ['smsToken'])
  },

  updateSettings: async (data, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})
    
    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    const companySettings = await CompanySettingsModel.findOne({where: {companyId: company.id}})

    if(!companySettings) {
      throw new ApiException(404, 'You don\'t have SMS configuration!')
    }

    return companySettings.update(data)
  },

  deleteSettings: async ({companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    const companySettings = await CompanySettingsModel.findOne({where: {companyId: company.id}})

    if(!companySettings) {
      throw new ApiException(404, 'You don\'t have SMS configuration!')
    }

    return companySettings.destroy({companyId})
  },

  getStats: async ({startDate, endDate}, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    const whereConditions = {
      companyId,
      status: COMPLETED
    }

    if(startDate) {
      whereConditions.date = {...whereConditions.date, [sequelize.Op.gt]: startDate,}
    }

    if(endDate) {
      whereConditions.date = {...whereConditions.date, [sequelize.Op.lt]: addDayToDate(endDate),}
    }

    const [stats] = await AppointmentModel.findAll(
      {
        where: whereConditions,
        attributes: [
          [sequelize.fn('sum', sequelize.col('total')), 'total'],
          [sequelize.fn('avg', sequelize.col('total')), 'average']
        ]
      })

    return stats
  },
}
