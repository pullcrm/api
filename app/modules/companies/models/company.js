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
    phone: {
      type: type.STRING,
      allowNull: true
    },
    description: {
      type: type.STRING,
      allowNull: true
    },
    address: {
      type: type.STRING,
      allowNull: true
    },
    telegram: {
      type: type.STRING,
      allowNull: true
    },
    viber: {
      type: type.STRING,
      allowNull: true
    },
    instagram: {
      type: type.STRING,
      allowNull: true
    },
    facebook: {
      type: type.STRING,
      allowNull: true
    },
  })
}

const CompanyModel = CompanySchema(mysql, Sequelize)
export default CompanyModel
