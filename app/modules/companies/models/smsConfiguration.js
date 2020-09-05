import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const SMSConfigurationSchema = (connection, type) => {
  return connection.define('sms_configurations', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: type.STRING,
      allowNull: false
    }
  })
}

const SMSConfigurationModel = SMSConfigurationSchema(mysql, Sequelize)
export default SMSConfigurationModel
