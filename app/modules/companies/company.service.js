import sequelize from 'sequelize'
import {mysql} from '../../config/connections'
import CompanyModel from './models/company'
import SpecialistModel from "../specialists/models/specialist"
import RoleModel from "../roles/role.model"
import CityModel from "../cities/city.model"
import TypeModel from "./models/types"
import ApiException from "../../exceptions/api"
import FileModel from '../files/file.model'
import AppointmentModel from '../appointments/appointment.model'
import {COMPLETED} from '../../constants/appointments'
import TimeWorkModel from '../timework/timework.model'
import WidgetSettingsModel from '../widget/models/settings.model'
import SMSSettingsModel from '../sms/models/settings.model'

export default {
  findOne: async params => {
    const company = await CompanyModel.findOne({where: params, attributes: {exclude: ['userId', 'cityId', 'logoId']},
      include: [
        {model: TypeModel},
        {model: CityModel},
        {model: WidgetSettingsModel},
        {model: SMSSettingsModel},
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

  findAllGlobal: async ({search}) => {
    const where = {}

    if(search) {
      where.search = search
    }

    const companies = await CompanyModel.findAll({
      where: {name: {[sequelize.Op.like]: `%${search}%`}},
      include: [
        {model: TypeModel},
        {model: CityModel},
        {model: WidgetSettingsModel},
        {model: SMSSettingsModel},
        {model: FileModel, as: 'logo'}
      ]
    })

    return companies
  },

  create: async data => {
    const result = await mysql.transaction(async transaction => {
      const company = await CompanyModel.create(data, {include: [{model: CityModel}, {model: TypeModel}], transaction})
      const adminRole = await RoleModel.findOne({where: {name: 'ADMIN'}, raw: true, transaction})
      await SpecialistModel.create({userId: company.userId, companyId: company.id, roleId: adminRole.id}, {transaction})
      await TimeWorkModel.create({companyId: company.id}, {transaction})
      await WidgetSettingsModel.create({companyId: company.id}, {transaction})
      return company
    })

    return result
  },

  update: async (data, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(!company) {
      throw new ApiException(404, 'Company wasn\'t found')
    }

    const result = await mysql.transaction(async transaction => {
      await company.update(data, {plain: true, transaction})

      return company
    })

    return result
  },

  getStats: async ({startDate, endDate}, {companyId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})
    
    if(!company) {
      throw new ApiException(404, 'Компанії не існує')
    }

    const whereConditions = {
      companyId,
      status: COMPLETED
    }

    if(startDate) {
      whereConditions.date = {...whereConditions.date, [sequelize.Op.gte]: startDate,}
    }

    if(endDate) {
      whereConditions.date = {...whereConditions.date, [sequelize.Op.lte]: endDate,}
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

  getTypes: async () => {
    const types = await TypeModel.findAll()

    return types
  }
}
