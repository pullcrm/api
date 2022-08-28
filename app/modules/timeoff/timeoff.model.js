import {Sequelize} from 'sequelize'
import {mysql} from '../../config/connections'

const TimeOffSchema = (connection, type) => {
  return connection.define('time_off', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    startDateTime: {
      type: type.DATE,
      allowNull: false,
    },
    endDateTime: {
      type: type.DATE,
      allowNull: false,
    },
    description: {
      type: type.STRING,
      allowNull: false,
      defaultValue: ''
    }
  }
  )
}

const TimeOffModel = TimeOffSchema(mysql, Sequelize)

export default TimeOffModel

