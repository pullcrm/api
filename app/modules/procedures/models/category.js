import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const ProcedureCategoriesSchema = (connection, type) => {
  return connection.define('procedure_categories', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false
    },
  })
}

const ProcedureCategoriesModel = ProcedureCategoriesSchema(mysql, Sequelize)
export default ProcedureCategoriesModel
