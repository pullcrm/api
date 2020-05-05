import {mysql} from "./config/connections";
import UserModel from './modules/users/user.model'
import CompanyModel from './modules/companies/models/company'
import ApproachModel from "./modules/companies/models/approach";
import RoleModel from './modules/roles/role.model'
import AppointmentModel from "./modules/appointments/appointment.model";
import ProcedureModel from "./modules/procedures/procedure.model";
import CityModel from "./modules/cities/city.model";
import CategoryModel from "./modules/categories/category.model";

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
CompanyModel.belongsTo(CityModel)
CompanyModel.belongsTo(CategoryModel)

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

mysql.sync({force: true}).then(async () => {
  console.debug('Database sync executed correctly')

  const rolesCount = await RoleModel.count()
  const categoriesCount = await CategoryModel.count()
  const citiesCount = await CityModel.count()

  if(rolesCount === 0) {
    await RoleModel.bulkCreate([{name: 'ADMIN'}, {name: 'INVITED'}])
  }

  if(categoriesCount === 0) {
    await CategoryModel.bulkCreate([{name: 'Перукарня'}, {name: 'Пральня'}])
  }

  if(citiesCount === 0) {
    await CityModel.bulkCreate([{name: 'Чернівці'}, {name: 'Київ'}])
  }
})
