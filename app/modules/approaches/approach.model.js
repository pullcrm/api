import {mysql} from "../../config/connections"
import {Sequelize} from "sequelize"

const ApproachSchema = (connection, type) => {
  return connection.define('approaches', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    }
  })
}

const ApproachModel = ApproachSchema(mysql, Sequelize)
export default ApproachModel
