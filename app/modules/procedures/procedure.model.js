import {mysql} from "../../config/connections";
import {Sequelize} from "sequelize";

const ProcedureSchema = (connection, type) => {
  return connection.define('procedures', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: type.DATEONLY,
      allowNull: false
    },
    timeStart: {
      type: type.TIME,
      allowNull: false
    },
    timeEnd: {
      type: type.TIME,
      allowNull: false
    },
    total: {
      type: type.INTEGER,
      allowNull: false,
    },
    status: {
      type: type.ENUM('COMPLETED', 'IN_PROGRESS'),
      allowNull: false,
    }
  })
}

const ProcedureModel = ProcedureSchema(mysql, Sequelize)

// ProcedureModel.hasMany()

export default ProcedureModel
