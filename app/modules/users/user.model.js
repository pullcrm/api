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
    firstName: {
      type: type.STRING(50),
      allowNull: true,

      validate: {
        len: {
          args: [0, 50],
          msg: 'First Name should be in a range between 0 and 50.'
        }
      }
    },
    lastName: {
      type: type.STRING(100),
      allowNull: true,

      validate: {
        len: {
          args: [0, 100],
          msg: 'First Name should be in a range between 0 and 100.'
        }
      }
    },

    phone: {
      type: type.STRING(10),
      allowNull: false,
      unique: true,

      validate: {
        len: {
          args: [0, 10],
          msg: 'Phone number should be in a range between 0 and 10.'
        }
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
      }
    }
  }
  )
}

const UserModel = UserSchema(mysql, Sequelize)

export default UserModel

