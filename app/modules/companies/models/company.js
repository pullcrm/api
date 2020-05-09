import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const CompanySchema = (connection, type) => {
  return connection.define('companies', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false
    },
    logo: {
      type: type.STRING,
      allowNull: true
    },
    type: {
      type: type.STRING,
      allowNull: true
    },
  })
}

const CompanyModel = CompanySchema(mysql, Sequelize)
export default CompanyModel
