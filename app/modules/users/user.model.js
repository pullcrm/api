import {Sequelize} from 'sequelize'
import bcrypt from 'bcrypt'
import {mysql} from '../../config/connections'

const encryptPassword = password =>  bcrypt.hashSync(password, 10)

const UserSchema = (connection, type) => {
  return connection.define('users', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: {
      type: type.STRING(255),
      allowNull: true,
    },
    phone: {
      type: type.STRING(10),
      allowNull: false,
      unique: {
        msg: 'Такий номер вже існує',
      }
    },
    email: {
      type: type.STRING(100),
      allowNull: true,
      unique: true,
    },
    password: {
      type: type.STRING,
      allowNull: true,
    },
    telegramId: {
      type: type.BIGINT,
      allowNull: true,
    },
    active: {
      type: type.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    }
  }, {
    defaultScope: {
      attributes: {exclude: ['password', 'refreshTokens']}
    },
    scopes: {
      withPasswordAndRefreshToken: {
        attributes: {}
      },
    },
    hooks: {
      beforeCreate: user => {
        if(user.password) {
          user.password = encryptPassword(user.password)
        }
      },

      beforeUpdate: user => {
        if(user.password) {
          user.password = encryptPassword(user.password)
        }
      },

      beforeBulkUpdate: options => {
        if(options.attributes.password) {
          options.attributes.password = encryptPassword(options.attributes.password)
        }
      },

      validationFailed(instance, options, error) {
        console.log('HOOK', options, error)
      }
    }
  }
  )
}

const UserModel = UserSchema(mysql, Sequelize)

export default UserModel

