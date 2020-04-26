import {Sequelize} from 'sequelize'
import bcrypt from 'bcrypt'
import {mysql} from '../../config/connections'

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
      },
      refreshToken: {
        type: type.STRING,
        allowNull: true,
        defaultValue: ''
      }
    }, {
      defaultScope: {
        attributes: { exclude: ['password', 'refreshToken'] }
      },
      scopes: {
        withPasswordAndRefreshToken: {
          attributes: {}
        },
      },
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

const UserModel = UserSchema(mysql, Sequelize)

export default UserModel

