import {mysql} from "../../config/connections"
import {Sequelize} from "sequelize"

const ClientSchema = (connection, type) => {
  return connection.define('clients', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: type.STRING(255),
      allowNull: false,
    },
    phone: {
      type: type.STRING(10),
      allowNull: true,
    },
    email: {
      type: type.STRING(100),
      allowNull: true,
    },

    birthday: {
      type: type.DATE,
      allowNull: true,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['companyId', 'phone']
      }
    ]
  })
}

const ClientModel = ClientSchema(mysql, Sequelize)
export default ClientModel
