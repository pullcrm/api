import {mysql} from "./config/connections"
import UserModel from './modules/users/user.model'
import CompanyModel from './modules/companies/models/company'
import ApproachModel from "./modules/approaches/approach.model"
import RoleModel from './modules/roles/role.model'
import AppointmentModel from "./modules/appointments/appointment.model"
import ProcedureModel from "./modules/procedures/procedure.model"
import CityModel from "./modules/cities/city.model"
import CategoryModel from "./modules/categories/category.model"
import FileModel from './modules/files/file.model'
import TokenModel from "./modules/auth/models/token"
import SMSConfigurationModel from "./modules/companies/models/smsConfiguration"
import TimeOffModel from './modules/timeoff/timeoff.model'
import TimeOffService from './modules/timeoff/timeoff.service'

TimeOffService.checkTime({startTile: '17:56:01', date: '2020-10-19 00:00:00', employeeId: 1})

CompanyModel.belongsToMany(UserModel, {
  as: 'staff',
  through: {model: ApproachModel, unique: false},
})

CompanyModel.belongsTo(UserModel, {
  as: 'owner',
  foreignKey: 'userId'
})

ApproachModel.belongsTo(UserModel)
ApproachModel.belongsTo(CompanyModel)
TimeOffModel.belongsTo(ApproachModel, {as: 'employee'})

UserModel.hasMany(ApproachModel)
UserModel.hasMany(TokenModel, {as: 'tokens'})
UserModel.belongsTo(FileModel, {as: 'avatar'})

CompanyModel.hasMany(ApproachModel)
CompanyModel.hasOne(SMSConfigurationModel)
CompanyModel.belongsTo(CityModel)
CompanyModel.belongsTo(CategoryModel)

RoleModel.hasMany(ApproachModel)
ApproachModel.belongsTo(RoleModel)

AppointmentModel.belongsToMany(ProcedureModel,{
  through: 'appointment_procedures',
  as: 'procedures',
  timestamps: false
})

ProcedureModel.belongsToMany(AppointmentModel,{
  through: 'appointment_procedures',
  timestamps: false
})

UserModel.belongsToMany(ProcedureModel,{
  through: 'user_procedures',
  timestamps: false
})

ProcedureModel.belongsToMany(UserModel,{
  through: 'user_procedures',
  timestamps: false
})

CompanyModel.hasMany(ProcedureModel)
CompanyModel.belongsTo(FileModel, {as: 'logo'})

AppointmentModel.belongsTo(CompanyModel)
AppointmentModel.belongsTo(UserModel, {as: 'client'})
AppointmentModel.belongsTo(UserModel, {as: 'employee'})

FileModel.belongsToMany(UserModel, {
  through: 'file_users',
  timestamps: false
})

mysql.sync().then(async () => {
  console.debug('Database sync executed correctly')

  const rolesCount = await RoleModel.count()
  const categoriesCount = await CategoryModel.count()
  const citiesCount = await CityModel.count()

  if(rolesCount === 0) {
    await RoleModel.bulkCreate([{name: 'ADMIN'}, {name: 'INVITED'}, {name: 'EMPLOYEE'}])
  }

  if(categoriesCount === 0) {
    await CategoryModel.bulkCreate([{name: 'Barbershop'}, {name: 'Салон красоты'}])
  }

  if(citiesCount === 0) {
    await CityModel.bulkCreate([{name: 'Черновцы'}, {name: 'Киев'}])
  }
})
