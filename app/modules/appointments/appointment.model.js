import {Sequelize} from 'sequelize'
import {mysql} from '../../config/connections'
import {IN_PROGRESS, COMPLETED, CANCELED, IN_QUEUE} from '../../constants/appointments'

const AppointmentSchema = (connection, type) => {
  return connection.define('appointments', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: type.DATE,
      allowNull: true,
    },
    startTime: {
      type: type.TIME,
      allowNull: true,
    },
    phone: {
      type: type.STRING,
      allowNull: true,
    },
    fullName: {
      type: type.STRING,
      allowNull: true,
    },
    totalDuration: {
      type: type.BIGINT,
      allowNull: false,
      defaultValue: 0
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
      type: type.ENUM(IN_PROGRESS, COMPLETED, CANCELED, IN_QUEUE),
      allowNull: false,
      defaultValue: IN_QUEUE
    },
    source: {
      type: type.STRING,
      allowNull: true
    }
  })
}

const AppointmentModel = AppointmentSchema(mysql, Sequelize)

export default AppointmentModel
