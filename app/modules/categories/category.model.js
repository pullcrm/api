import {mysql} from "../../config/connections"
import {Sequelize} from "sequelize"

const CategorySchema = (connection, type) => {
  return connection.define('categories', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false,
      unique: true
    },
    type: {
      type: type.STRING,
      allowNull: false
    }
  })
}

const CategoryModel = CategorySchema(mysql, Sequelize)

export default CategoryModel
