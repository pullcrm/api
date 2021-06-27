import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const ProcedureSchema = (connection, type) => {
  return connection.define('procedures', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false,
      defaultValue: ''
    },
    price: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    duration: {
      type: type.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    description: {
      type: type.STRING,
      allowNull: false,
      defaultValue: ''
    },
    order: {
      type: type.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    hooks: {
      afterUpdate: options => {
        delete options.dataValues.companyId
      }
    }
  })
}

const ProcedureModel = ProcedureSchema(mysql, Sequelize)

export default ProcedureModel
