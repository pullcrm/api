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
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
      // isStep15Minutes(value) {
      //   if (new Date(+value * 1000).getMinutes() % 15 !== 0) {
      //     throw new Error('Step should be 15m')
      //   }
      // }
    },
    phone: {
      type: type.STRING,
    },
    fullname: {
      type: type.STRING,
    },
    total: {
      type: type.INTEGER,
      allowNull: false,
    }
  })
}

const AppointmentModel = AppointmentSchema(mysql, Sequelize)

export default AppointmentModel
