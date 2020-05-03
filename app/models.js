import {mysql} from "./config/connections";
import UserModel from './modules/users/user.model'
import CompanyModel from './modules/companies/models/company'
import ApproachModel from "./modules/companies/models/approach";
import RoleModel from './modules/roles/role.model'
import AppointmentModel from "./modules/appointments/appointment.model";
import ProcedureModel from "./modules/procedures/procedure.model";
import AddressModel from "./modules/companies/models/address";

CompanyModel.belongsToMany(UserModel, {
  as: 'employers',
  through: {model: ApproachModel, unique: false},
})

CompanyModel.belongsTo(UserModel, {
  as: 'owner',
  foreignKey: 'userId'
})

// UserModel.belongsToMany(CompanyModel, {
//   as: 'employers',
//   through: {model: ApproachModel, unique: false},
// })

ApproachModel.belongsTo(UserModel)
ApproachModel.belongsTo(CompanyModel)
UserModel.hasMany(ApproachModel)
CompanyModel.hasMany(ApproachModel)
CompanyModel.hasOne(AddressModel)

RoleModel.hasMany(ApproachModel)
ApproachModel.belongsTo(RoleModel)

AppointmentModel.belongsToMany(ProcedureModel,{
  through: 'appointment_procedures',
  timestamps: false
})

ProcedureModel.belongsToMany(AppointmentModel,{
  through: 'appointment_procedures',
  timestamps: false
})

CompanyModel.hasMany(ProcedureModel)

AppointmentModel.belongsTo(CompanyModel)
AppointmentModel.belongsTo(UserModel, {as: 'client'})
AppointmentModel.belongsTo(UserModel, {as: 'employer'})

mysql.sync({}).then(() => {console.debug('Database sync executed correctly')})
