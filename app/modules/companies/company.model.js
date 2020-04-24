import {mysql} from "../../config/connections";
import {Sequelize} from "sequelize";

const CompanySchema = (connection, type) => {
  return connection.define('companies', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  })
}

const CompanyModel = CompanySchema(mysql, Sequelize)

export default CompanyModel
