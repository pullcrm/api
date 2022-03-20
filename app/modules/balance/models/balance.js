import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const BalanceSchema = (connection, type) => {
  return connection.define('roles', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false
    }
  })
}

const BalanceModel = BalanceSchema(mysql, Sequelize)

export default BalanceModel
