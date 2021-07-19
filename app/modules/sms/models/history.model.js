import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const SMSHistorySchema = (connection, type) => {
  return connection.define("sms_history", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: type.STRING,
      allowNull: false,
    },
    recipient: {
      type: type.STRING,
      allowNull: false,
    },
    smsIdentifier: {
      type: type.STRING,
      allowNull: true,
    },
    message: {
      type: type.STRING,
      allowNull: false,
    },
    datetime: {
      type: type.DATE,
      allowNull: false,
    }
  })
}

const SMSHistoryModel= SMSHistorySchema(mysql, Sequelize)

export default SMSHistoryModel
