import {Sequelize} from 'sequelize'
import {mysql} from '../../config/connections'
import bcrypt from 'bcrypt'

const UserSchema = (connection, type) => {
  return connection.define('users', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: type.STRING(50),
        allowNull: false,

        validate: {
          len: {
            args: [0, 50],
            msg: 'First Name should be in a range between 0 and 50.'
          }
        }
      },
      lastName: {
        type: type.STRING(100),
        allowNull: false,

        validate: {
          len: {
            args: [0, 100],
            msg: 'First Name should be in a range between 0 and 100.'
          }
        }
      },
      email: {
        type: type.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: type.STRING,
      },
      avatar: {
        type: type.STRING,
        allowNull: true
      }
    }, {
      hooks: {
        beforeCreate: (user) => {
          {
            user.password = bcrypt.hashSync(user.password, 10);
          }
        }
      }
    }
  )
}

export default UserSchema(mysql, Sequelize)

