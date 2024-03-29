import {mysql} from "./config/connections"
import {ADMIN, CLIENT, INVITED, MANAGER, SPECIALIST} from './constants/roles'
import UserModel from './modules/users/user.model'
import CompanyModel from './modules/companies/models/company'
import SpecialistModel from "./modules/specialists/models/specialist"
import RoleModel from './modules/roles/role.model'
import AppointmentModel from "./modules/appointments/appointment.model"
import ProcedureModel from "./modules/procedures/models/procedure"
import CityModel from "./modules/cities/city.model"
import CategoryModel from "./modules/categories/category.model"
import FileModel from './modules/files/file.model'
import TokenModel from "./modules/auth/models/token"
import TimeOffModel from './modules/timeoff/timeoff.model'
import ClientModel from "./modules/clients/client.model"
import TimeWorkModel from "./modules/timework/models/companyTimework"
import SpecialistTimeWorkModel from "./modules/timework/models/specialistTimework"
import TypeModel from "./modules/companies/models/types"
import SMSHistoryModel from "./modules/sms/models/history.model"
import SMSSettingsModel from "./modules/sms/models/settings.model"
import WidgetSettingsModel from "./modules/widget/models/settings.model"
import OrderModel from './modules/balance/models/order'
import BalanceModel from "./modules/balance/models/balance"

CompanyModel.belongsTo(UserModel, {
  as: 'owner',
  foreignKey: 'userId'
})

SpecialistModel.belongsTo(UserModel)
SpecialistModel.belongsTo(CompanyModel)

TimeOffModel.belongsTo(SpecialistModel, {as: 'specialist'})
SpecialistTimeWorkModel.belongsTo(SpecialistModel, {as: 'specialist'})

UserModel.hasMany(SpecialistModel)
UserModel.hasMany(TokenModel, {as: 'tokens'})
UserModel.belongsTo(FileModel, {as: 'avatar'})
UserModel.hasMany(OrderModel)
UserModel.hasMany(BalanceModel)

CompanyModel.hasMany(SpecialistModel)
CompanyModel.hasOne(SMSSettingsModel)
CompanyModel.hasOne(WidgetSettingsModel)
CompanyModel.belongsTo(CityModel)
CompanyModel.belongsTo(TypeModel)

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

ProcedureModel.belongsTo(CategoryModel, {onDelete: 'cascade'})
CategoryModel.hasMany(ProcedureModel)
CategoryModel.belongsTo(CompanyModel)
SMSHistoryModel.belongsTo(CompanyModel)

ClientModel.belongsTo(CompanyModel)

SpecialistModel.belongsToMany(ProcedureModel,{
  through: 'specialist_procedures',
  as: 'procedures',
  timestamps: false
})

ProcedureModel.belongsToMany(SpecialistModel,{
  through: 'specialist_procedures',
  as: 'specialists',
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
  const typesCount = await TypeModel.count()
  const citiesCount = await CityModel.count()

  if(rolesCount === 0) {
    await RoleModel.bulkCreate([{name: ADMIN}, {name: INVITED}, {name: SPECIALIST}, {name: MANAGER}, {name: CLIENT}])
  }

  if(typesCount === 0) {
    await TypeModel.bulkCreate([{name: 'Барбершоп'}, {name: 'Салон краси'}])
  }

  if(citiesCount === 0) {
    await CityModel.bulkCreate([{name: 'Чернівці'}, {name: 'Київ'}])
  }
}).catch(e => console.log(e))
