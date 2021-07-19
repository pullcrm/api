import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const SMSSettingsSchema = (connection, type) => {
  return connection.define('sms_settings', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    smsToken: {
      type: type.STRING(400),
      allowNull: false
    },
    hasRemindSMS: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    remindSMSMinutes: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 60,
    },
    hasCreationSMS: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    creationSMSTemplate: {
      type: type.STRING,
      allowNull: true
    },
    remindSMSTemplate: {
      type: type.STRING,
      allowNull: true
    },
    companyName: {
      type: type.STRING,
      allowNull: true
    }
  }, {
    defaultScope: {
      attributes: {exclude: ['smsToken']}
    },
    scopes: {
      withSMSToken: {
        attributes: {}
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["companyId"]
      }
    ]
  })
}

const SMSSettingsModel = SMSSettingsSchema(mysql, Sequelize)
export default SMSSettingsModel
