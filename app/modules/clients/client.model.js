import {mysql} from "../../config/connections"
import {Sequelize} from "sequelize"

const ClientSchema = (connection, type) => {
  return connection.define('clients', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
  })
}

const ClientModel = ClientSchema(mysql, Sequelize)
export default ClientModel
