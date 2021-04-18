import {mysql} from "./config/connections"
import {ADMIN, INVITED, SPECIALIST} from './constants/roles'
import UserModel from './modules/users/user.model'
import CompanyModel from './modules/companies/models/company'
import SpecialistModel from "./modules/specialists/specialist.model"
import RoleModel from './modules/roles/role.model'
import AppointmentModel from "./modules/appointments/appointment.model"
import ProcedureModel from "./modules/procedures/models/procedure"
import CityModel from "./modules/cities/city.model"
import CategoryModel from "./modules/categories/category.model"
import FileModel from './modules/files/file.model'
import TokenModel from "./modules/auth/models/token"
import CompanySettingsModel from "./modules/companies/models/settings"
import TimeOffModel from './modules/timeoff/timeoff.model'
import ClientModel from "./modules/clients/client.model"
import ProcedureCategoriesModel from './modules/procedures/models/category'
import TimeWorkModel from "./modules/timework/timework.model"

CompanyModel.belongsTo(UserModel, {
  as: 'owner',
  foreignKey: 'userId'
})

SpecialistModel.belongsTo(UserModel)
SpecialistModel.belongsTo(CompanyModel)

TimeOffModel.belongsTo(SpecialistModel, {as: 'specialist'})

UserModel.hasMany(SpecialistModel)
UserModel.hasMany(TokenModel, {as: 'tokens'})
UserModel.belongsTo(FileModel, {as: 'avatar'})

CompanyModel.hasMany(SpecialistModel)
CompanyModel.hasOne(CompanySettingsModel)
CompanyModel.belongsTo(CityModel)
CompanyModel.belongsTo(CategoryModel)

RoleModel.hasMany(SpecialistModel)
SpecialistModel.belongsTo(RoleModel)

AppointmentModel.belongsToMany(ProcedureModel,{
  through: 'appointment_procedures',
  as: 'procedures',
  timestamps: false
})

ProcedureModel.belongsToMany(AppointmentModel,{
  through: 'appointment_procedures',
  timestamps: false
})

ProcedureModel.belongsTo(ProcedureCategoriesModel)
ProcedureCategoriesModel.belongsTo(CompanyModel)

UserModel.belongsToMany(CompanyModel, {through: ClientModel})
ClientModel.belongsTo(UserModel)

UserModel.belongsToMany(ProcedureModel,{
  through: 'user_procedures',
  timestamps: false
})

ProcedureModel.belongsToMany(UserModel,{
  through: 'user_procedures',
  timestamps: false
})

ProcedureModel.belongsToMany(SpecialistModel,{
  through: 'specialist_procedures',
  timestamps: false
})

CompanyModel.hasMany(ProcedureModel)
CompanyModel.belongsTo(FileModel, {as: 'logo'})

AppointmentModel.belongsTo(CompanyModel)
AppointmentModel.belongsTo(ClientModel, {as: 'client'})
AppointmentModel.belongsTo(SpecialistModel, {as: 'specialist'})

FileModel.belongsToMany(UserModel, {
  through: 'file_users',
  timestamps: false
})

TimeWorkModel.belongsTo(CompanyModel, {as: 'company'})

mysql.sync().then(async () => {
  console.debug('Database sync executed correctly')

  const rolesCount = await RoleModel.count()
  const categoriesCount = await CategoryModel.count()
  const citiesCount = await CityModel.count()

  if(rolesCount === 0) {
    await RoleModel.bulkCreate([{name: ADMIN}, {name: INVITED}, {name: SPECIALIST}])
  }

  if(categoriesCount === 0) {
    await CategoryModel.bulkCreate([{name: 'Barbershop'}, {name: 'Салон красоты'}])
  }

  if(citiesCount === 0) {
    await CityModel.bulkCreate([{name: 'Черновцы'}, {name: 'Киев'}])
  }
}).catch(e => console.log(e))
