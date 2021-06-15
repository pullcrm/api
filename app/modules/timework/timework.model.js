import {Sequelize} from "sequelize"
import {mysql} from "../../config/connections"

const TimeWorkSchema = (connection, type) => {
  return connection.define("time_work", {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    monday: {
      type: type.STRING,
      allowNull: false,
      defaultValue: 'true;09:00;21:00'
    },
    tuesday: {
      type: type.STRING,
      allowNull: false,
      defaultValue: 'true;09:00;21:00'
    },
    wednesday: {
      type: type.STRING,
      allowNull: false,
      defaultValue: 'true;09:00;21:00'
    },
    thursday: {
      type: type.STRING,
      allowNull: false,
      defaultValue: 'true;09:00;21:00'
    },
    friday: {
      type: type.STRING,
      allowNull: false,
      defaultValue: 'true;09:00;21:00'
    },
    saturday: {
      type: type.STRING,
      allowNull: false,
      defaultValue: 'true;09:00;21:00'
    },
    sunday: {
      type: type.STRING,
      allowNull: false,
      defaultValue: 'true;09:00;21:00'
    },
  })
}

const TimeWorkModel = TimeWorkSchema(mysql, Sequelize)

export default TimeWorkModel
