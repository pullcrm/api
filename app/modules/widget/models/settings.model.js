import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const WidgetSettingsSchema = (connection, type) => {
  return connection.define('widget_settings', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    isActive: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isQueue: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    daysForward: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 14,
    },
    minutesBefore: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ["companyId"]
      }
    ]
  })
}

const WidgetSettingsModel = WidgetSettingsSchema(mysql, Sequelize)
export default WidgetSettingsModel
