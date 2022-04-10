import SpecialistModel from './models/specialist'
import SpecialistRegistrationsModel from './models/registrations'
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
import {mysql} from '../../config/connections'
import SMSGlobalService from "../sms/services/sms.global"
import {makeRandom} from '../../utils/make-random'

export default {
  findAll: async ({companyId}) => {
    return SpecialistModel.findAll({companyId})
  },

  getUserBySpecialistId: async ({specialistId}) => {
    const specialist = await SpecialistModel.findOne({where: {id: specialistId}, include: [{
      model: UserModel
    }]})
  
    return specialist.user
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

  create: async (data, params) => {
    const result = await mysql.transaction(async transaction => {
      let user = await UserModel.findOne({where: {phone: data.phone}})

      if(user) {
        const existingSpecialist = await SpecialistModel.findOne({where: {userId: user.id, companyId: params.companyId}})

        if(existingSpecialist) {
          throw new ApiException(400, 'Такий користувач вже є в компанії')
        }
      }

      if(!user) {
        user = await UserModel.create({phone: data.phone, fullName: data.fullName, active: false}, {returning: true})
      }

      const specialistsRole = await RoleModel.findOne({where: {name: 'SPECIALIST'}, raw: true, transaction})
      const specialist = await SpecialistModel.create({userId: user.id, companyId: params.companyId, roleId: specialistsRole.id}, {transaction})

      return {...specialist.toJSON(), user: user.toJSON()}
    })

    return result
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

  sendFinishLink: async ({specialistId, companyId}) => {
    const specialist = await SpecialistModel.findOne({where: {id: specialistId, companyId}})

    if (!specialist) {
      throw new ApiException(403, 'Specialist wasn\'t found')
    }

    const user = await UserModel.findOne({where: {id: specialist.userId}})

    if(!user || user.active) {
      throw new ApiException(400, 'Користувач вже активований')
    }

    let token = makeRandom(6)

    if (process.env.SMS_CLIENT_SEND_REAL_SMS === "false") {
      token = user.phone.substring(6, 10) /* Get last 4 digits from phone */
    }

    await SpecialistRegistrationsModel.create({
      token,
      phone: user.phone,
      companyId,
    })

    const link = `${process.env.CLIENT}/confirm/${token}`

    //TODO remove
    if(process.env.SMS_CLIENT_SEND_REAL_SMS === "false") {
      return {
        status: 'ok',
        link
      }
    }

    const status = await SMSGlobalService.sendImmediateGlobal({
      phone: user.phone,
      message: `Продовжити реєстрацію: ${link}`,
    })

    return status
  },
}