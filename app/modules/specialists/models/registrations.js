import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const SpecialistRegistrationsSchema = (connection, type) => {
  return connection.define('specialist_registrations', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: type.STRING,
      allowNull: false,
    },
    phone: {
      type: type.STRING,
      allowNull: false,
    },
    companyId: {
      type: type.BIGINT,
      allowNull: false,
    }
  }, 
  {
    indexes: [
      {
        unique: true,
        fields: ['token']
      }
    ]
  })
}

const SpecialistRegistrationsModel = SpecialistRegistrationsSchema(mysql, Sequelize)
export default SpecialistRegistrationsModel
