import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const CompleteRegistrationSchema = (connection, type) => {
  return connection.define('complete_registration', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    token: {
      type: type.STRING,
      allowNull: false
    },
  })
}

const CompleteRegistrationModel = CompleteRegistrationSchema(mysql, Sequelize)

export default CompleteRegistrationModel
