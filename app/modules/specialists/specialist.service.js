import SpecialistModel from './specialist.model'
import CompanyModel from "../companies/models/company"
import RoleModel from "../roles/role.model"
import UserModel from '../users/user.model'
import CityModel from "../cities/city.model"
import FileModel from '../files/file.model'
import CategoryModel from "../categories/category.model"
import ApiException from '../../exceptions/api'
import WidgetSettingsModel from '../widget/models/settings.model'
import SMSSettingsModel from '../sms/models/settings.model'
import {ALL} from '../../constants/specialists'
import ProcedureModel from '../procedures/models/procedure'
import TypeModel from '../companies/models/types'
import {Op} from 'sequelize'

export default {
  findAll: async ({companyId}) => {
    return SpecialistModel.findAll({companyId})
  },

  checkBy: async params => {
    const specialist = await SpecialistModel.findOne({where: params})

    if (!specialist) {
      throw new ApiException(403, 'You don\'t have permissions for that operation')
    }
  },

  activeCompany: async companyId => {
    const specialist = await SpecialistModel.findOne({where: companyId,
      include: [{
        model: CompanyModel
      }]
    })

    if(!specialist) {
      return {id: 0}
    }

    return specialist.company
  },

  index: async ({companyId, order, sort}) => {
    const specialists = await SpecialistModel.findAll({
      where: {companyId, [Op.not]: {status: 'DELETED'}},
      order: [
        [sort, order],
        ['id', order]
      ],
      attributes: {exclude: ['companyId', 'userId', 'roleId']},
      include: [{
        model: CompanyModel,
        attributes: {exclude: ['typeId', 'userId', 'cityId']},
        include: [
          {model: TypeModel},
          {model: CityModel},
          {model: WidgetSettingsModel},
          {model: SMSSettingsModel},
          {model: FileModel, as: 'logo'}
        ]
      },
      {model: ProcedureModel,
        as: 'procedures',
        attributes: {
          exclude: ['companyId', 'categoryId']
        },
        include: {
          model: CategoryModel,
          as: 'category'
        }
      },
      {model: RoleModel},
      {model: UserModel, include: {
        model: FileModel,
        as: 'avatar'
      }}]})
    
    return specialists
  },

  publicIndex: async ({companyId, order, sort}) => {
    const specialists = await SpecialistModel.findAll({
      where: {companyId, status: ALL},
      order: [
        [sort, order],
        ['id', order]
      ],
      attributes: {exclude: ['companyId', 'userId', 'roleId', 'status']},
      include: [{
        model: UserModel,
        attributes: ['fullName'],
        include: {
          model: FileModel,
          as: 'avatar'
        }
      }]
    })
    
    return specialists
  },

  findOne: async ({specialistId, status}) => {
    const baseCondition = {
      id: specialistId
    }

    if(status) {
      baseCondition.status = status
    }

    const specialist = await SpecialistModel.findOne({
      where: baseCondition,
      order: [
        [ProcedureModel, 'order', 'asc'],
        [ProcedureModel, 'id', 'asc']
      ],
      attributes: {exclude: ['companyId', 'userId', 'roleId']},
      include: [{
        model: CompanyModel,
        attributes: {exclude: ['typeId', 'userId', 'cityId']},
        include: [
          {model: TypeModel},
          {model: CityModel},
          {model: FileModel, as: 'logo'}
        ]
      },
      {
        model: ProcedureModel,
        as: 'procedures',
        attributes: {
          exclude: ['companyId', 'categoryId']
        },
        include: {
          model: CategoryModel,
          as: 'category'
        }
      },
      {model: RoleModel},
      {model: UserModel, include: {
        model: FileModel,
        as: 'avatar'
      }}]
    })

    if(!specialist) {
      throw new ApiException(404, 'Specialist wasn\'t found')
    }
    
    return specialist
  },

  update: async (data, params) => {
    const specialist = await SpecialistModel.findOne({where: {id: params.specialistId, companyId: params.companyId}})

    if(!specialist) {
      throw new ApiException(404, 'Specialist wasn\'t found')
    }

    if(data.role) {
      const specialistsRole = await RoleModel.findOne({where: {name: data.role}, raw: true})
      data.roleId = specialistsRole.id
    }

    return specialist.update(data)
  },

  bulkUpdate: async ({specialists}) => {
    return SpecialistModel.bulkCreate(specialists, {updateOnDuplicate: ['order']})
  },

  create: async (user, params, transaction) => {
    const specialistsRole = await RoleModel.findOne({where: {name: 'SPECIALIST'}, raw: true, transaction})
    return SpecialistModel.create({userId: user.id, companyId: params.companyId, roleId: specialistsRole.id}, {transaction})
  },

  destory: async ({specialistId}, {companyId}) => {
    const specialist = await SpecialistModel.findOne({where: {id: specialistId}})

    if(specialist.get('companyId') !== companyId) {
      throw new ApiException(403, 'You don\'t have such specialist in your company! ')
    }

    return specialist.destroy({cascade: true})
  },

  updateProcedures: async (data, params) => {
    const specialist = await SpecialistModel.findOne({where: {id: params.specialistId, companyId: params.companyId}})

    if(!specialist) {
      throw new ApiException(404, 'Specialist wasn\'t found')
    }

    const procedures = await ProcedureModel.findAll({where: {id: data.procedures}})

    if(!procedures.every(P => P.companyId === params.companyId)) {
      throw new ApiException(404, 'Procedure wasn\'t found')
    }

    specialist.setProcedures(data.procedures)

    return specialist
  },

  getProcedures: async ({specialistId, companyId}) => {
    const specialist = await SpecialistModel.findOne({where: {id: specialistId, companyId}})

    if (!specialist) {
      throw new ApiException(403, 'Specialist wasn\'t found')
    }

    return specialist.getProcedures()
  },
}