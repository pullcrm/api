import {Sequelize} from "sequelize"
import {mysql} from "../../config/connections"

const TimeWorkSchema = (connection, type) => {
  return connection.define("time_work", {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    monStart: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '09:00:00'
    },
    monEnd: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '21:00:00'
    },
    tueStart: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '09:00:00'
    },
    tueEnd: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '21:00:00'
    },
    wedStart: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '09:00:00'
    },
    wedEnd: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '21:00:00'
    },
    thuStart: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '09:00:00'
    },
    thuEnd: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '21:00:00'
    },
    friStart: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '09:00:00'
    },
    friEnd: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '21:00:00'
    },
    satStart: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '09:00:00'
    },
    satEnd: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '21:00:00'
    },
    sunStart: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '09:00:00'
    },
    sunEnd: {
      type: type.TIME,
      allowNull: true,
      defaultValue: '21:00:00'
    },
  })
}

const TimeWorkModel = TimeWorkSchema(mysql, Sequelize)

export default TimeWorkModel
