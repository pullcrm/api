import { Sequelize } from 'sequelize'
import { mysql } from '../../config/connections'

const UserSchema = (connection, type) => {
  return connection.define('users', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING(100),
      allowNull: false
    },
    since: {
      type: type.STRING(4),
      allowNull: true
    }
  })
}

export default UserSchema(mysql, Sequelize)

