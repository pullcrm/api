import {mysql} from "../../../config/connections";
import {Sequelize} from "sequelize";

const CompanySchema = (connection, type) => {
  return connection.define('companies', {
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

const CompanyModel = CompanySchema(mysql, Sequelize)
export default CompanyModel
