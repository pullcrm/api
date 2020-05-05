import {mysql} from "../../../config/connections";
import {Sequelize} from "sequelize";

const WorkTimeSchema = (connection, type) => {
  return connection.define('work_times', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
  })
}

const WorkTimeModel = WorkTimeSchema(mysql, Sequelize)
export default WorkTimeModel
