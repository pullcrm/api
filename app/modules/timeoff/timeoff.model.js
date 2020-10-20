import {Sequelize} from 'sequelize'
import {mysql} from '../../config/connections'

const TimeOffSchema = (connection, type) => {
  return connection.define('time_off', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: type.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    startTime: {
      type: type.TIME,
      allowNull: false,
    },
    endTime: {
      type: type.TIME,
      allowNull: false,
    },
  }
  )
}

const TimeOffModel = TimeOffSchema(mysql, Sequelize)

export default TimeOffModel

