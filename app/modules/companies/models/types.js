import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const TypeSchema = (connection, type) => {
  return connection.define('types', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false,
      unique: true
    }
  })
}

const TypeModel = TypeSchema(mysql, Sequelize)

export default TypeModel
