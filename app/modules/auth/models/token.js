import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const TokenSchema = (connection, type) => {
  return connection.define('tokens', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    refreshToken: {
      type: type.STRING,
      allowNull: false,
      unique: true,
    },

    device: {
      type: type.STRING,
      allowNull: false,
    }
  })
}

const TokenModel = TokenSchema(mysql, Sequelize)

export default TokenModel
