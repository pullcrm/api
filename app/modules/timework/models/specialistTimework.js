import {Sequelize} from "sequelize"
import {mysql} from "../../../config/connections"

const TimeWorkSchema = (connection, type) => {
  return connection.define("specialist_time_work", {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    startDateTime: {
      type: type.DATE,
      allowNull: false,
    },
    endDateTime: {
      type: type.DATE,
      allowNull: false,
    }
  })
}

const TimeWorkModel = TimeWorkSchema(mysql, Sequelize)

export default TimeWorkModel
