import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const BalanceSchema = (connection, type) => {
  return connection.define('balance', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: type.DOUBLE(10,2),
      allowNull: false
    },
    description: {
      type: type.STRING,
      allowNull: false
    }
  })
}

const BalanceModel = BalanceSchema(mysql, Sequelize)

export default BalanceModel
