import {mysql} from "../../config/connections";
import {Sequelize} from "sequelize";

const ProcedureSchema = (connection, type) => {
  return connection.define('procedures', {
    id: {
      type: type.INTEGER,
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
      type: type.TIME,
      allowNull: false
    },
  })
}

const ProcedureModel = ProcedureSchema(mysql, Sequelize)

// ProcedureModel.hasMany()

export default ProcedureModel
