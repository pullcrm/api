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
    },
    remindAfterCreation: {
      type: type.BOOLEAN,
      allowNull: false,
      default: true,
    },
    beforeTime: {
      type: type.INTEGER,
      allowNull: true,
    },
    remindBeforeTime: {
      type: type.BOOLEAN,
      allowNull: false,
      default: false,
    },
  })
}

const SMSConfigurationModel = SMSConfigurationSchema(mysql, Sequelize)
export default SMSConfigurationModel
