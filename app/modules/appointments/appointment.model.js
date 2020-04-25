import {Sequelize} from 'sequelize'
import {mysql} from '../../config/connections'

// companyId
// serviceIds: [1, 2]
// total: number
// employeeId (`staff`)
// date: Дата в який день проходить запис 21.04.2020
// timeStart: 14:00
// timeEnd 16:00
// status: ‘COMPLETED’ | ‘INPROGRESS’
// clientId: (‘Customer’)

const AppointmentSchema = (connection, type) => {
  return connection.define('appointments', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: type.DATEONLY,
      allowNull: false
    },
    timeStart: {
      type: type.TIME,
      allowNull: false
    },
    timeEnd: {
      type: type.TIME,
      allowNull: false
    },
    total: {
      type: type.INTEGER,
      allowNull: false,
    },
    status: {
      type: type.ENUM('COMPLETED', 'IN_PROGRESS'),
      allowNull: false,
    }
  })
}

const AppointmentModel = AppointmentSchema(mysql, Sequelize)

export default AppointmentModel
