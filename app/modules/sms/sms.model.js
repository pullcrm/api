import {mysql} from "../../config/connections"
import {Sequelize} from "sequelize"
import {encrypt} from '../../utils/crypto'

const SMSConfigurationSchema = (connection, type) => {
  return connection.define('sms_configurations', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: type.STRING,
      allowNull: false
    },
    remindAfterCreation: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    remindBeforeInMinutes: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 60,
    },
    remindBefore: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    login: {
      type: type.STRING,
      allowNull: false
    },
    password: {
      type: type.STRING,
      allowNull: false
    },
  }, {
    hooks: {
      beforeCreate: config => {
        if(config.password) {
          config.password = encrypt(config.password)
        }
      },

      beforeUpdate: config => {
        if(config.password) {
          config.password = encrypt(config.password)
        }
      },

      beforeBulkUpdate: options => {
        if(options.attributes.password) {
          options.attributes.password = encrypt(options.attributes.password)
        }
      }
    }
  })
}

const SMSConfigurationModel = SMSConfigurationSchema(mysql, Sequelize)
export default SMSConfigurationModel
