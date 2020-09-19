import {mysql} from "../../config/connections"
import {Sequelize} from "sequelize"

const ApproachSchema = (connection, type) => {
  return connection.define('approaches', {
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

const ApproachModel = ApproachSchema(mysql, Sequelize)
export default ApproachModel
