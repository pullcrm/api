import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const ConfirmationSchema = (connection, type) => {
  return connection.define('confirmations', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    phone: {
      type: type.STRING,
      allowNull: false,
      unique: true,
    },

    code: {
      type: type.STRING,
      allowNull: false
    },
  })
}

const ConfirmationModel = ConfirmationSchema(mysql, Sequelize)

export default ConfirmationModel
