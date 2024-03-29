import {mysql} from "../../config/connections"
import {Sequelize} from "sequelize"

const RoleSchema = (connection, type) => {
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

const RoleModel = RoleSchema(mysql, Sequelize)

export default RoleModel
