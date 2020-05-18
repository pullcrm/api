import {mysql} from "../../config/connections"
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
      allowNull: false
    },
    price: {
      type: type.INTEGER,
      allowNull: false,
    },
    duration: {
      type: type.BIGINT,
      allowNull: false
    },
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
