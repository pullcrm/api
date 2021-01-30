import {mysql} from "../../config/connections"
import {Sequelize} from "sequelize"

const SpecialistSchema = (connection, type) => {
  return connection.define('specialists', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    status: {
      type: type.ENUM('ALL', 'DASHBOARD', 'HIDE'),
      allowNull: false,
      defaultValue: 'ALL'
    },

    description: {
      type: type.STRING,
      allowNull: false,
      defaultValue: ''
    }
  })
}

const SpecialistModel = SpecialistSchema(mysql, Sequelize)
export default SpecialistModel