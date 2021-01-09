import {Sequelize} from 'sequelize'
import {mysql} from '../../config/connections'
import {IN_PROGRESS, COMPLETED, CANCELED} from '../../constants/appointments'

const AppointmentSchema = (connection, type) => {
  return connection.define('appointments', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: type.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
      // isStep15Minutes(value) {
      //   if (new Date(+value * 1000).getMinutes() % 15 !== 0) {
      //     throw new Error('Step should be 15m')
      //   }
      // }
    },
    startTime: {
      type: type.TIME,
      allowNull: true,
    },
    isQueue: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    phone: {
      type: type.STRING,
    },
    fullName: {
      type: type.STRING,
    },
    total: {
      type: type.INTEGER,
      allowNull: false,
    },
    description: {
      type: type.STRING,
      allowNull: true,
    },
    smsIdentifier: {
      type: type.STRING,
      allowNull: true,
    },
    status: {
      type: type.ENUM(IN_PROGRESS, COMPLETED, CANCELED),
      allowNull: false,
      defaultValue: IN_PROGRESS
    },
    source: {
      type: type.STRING,
      allowNull: true
    }
  })
}

const AppointmentModel = AppointmentSchema(mysql, Sequelize)

export default AppointmentModel
