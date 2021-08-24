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
      unique: {
        args: 'phone',
        msg: 'Такая категория уже существует'
      }
    },
    type: {
      type: type.STRING,
      allowNull: false
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['name', 'companyId', 'type']
      }
    ]
  }
  )
}

const CategoryModel = CategorySchema(mysql, Sequelize)

export default CategoryModel
