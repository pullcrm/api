import UserModel from './modules/users/user.model'
import CompanyModel from './modules/companies/company.model'
import RoleModel from './modules/roles/role.model'
import AppointmentModel from "./modules/appointments/appointment.model";
import ProcedureModel from "./modules/procedures/procedure.model";

CompanyModel.hasMany(UserModel)

UserModel.belongsTo(CompanyModel)
UserModel.belongsTo(RoleModel)

AppointmentModel.belongsToMany(ProcedureModel,{
  through: 'appointment_procedures',
  timestamps: false
})

ProcedureModel.belongsToMany(AppointmentModel,{
  through: 'appointment_procedures',
  timestamps: false
})

AppointmentModel.belongsTo(CompanyModel)
AppointmentModel.belongsTo(UserModel, {as: 'client'})
AppointmentModel.belongsTo(UserModel, {as: 'employer'})
