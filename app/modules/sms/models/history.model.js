import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const SMSHistorySchema = (connection, type) => {
  return connection.define("sms_history", {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    recipient: {
      type: type.STRING,
      allowNull: false,
    },
    sendDate: {
      type: type.DATE,
      allowNull: true,
    },
    price: {
      type: type.DOUBLE(10, 2),
      allowNull: false,
    },
    lifecellId: {
      type: type.STRING,
      allowNull: true,
    },
    jobId: {
      type: type.STRING,
      allowNull: true,
    },
    message: {
      type: type.STRING,
      allowNull: false,
    },
    status: {
      type: type.STRING,
      allowNull: false,
    }
  })
}

const SMSHistoryModel= SMSHistorySchema(mysql, Sequelize)

export default SMSHistoryModel
