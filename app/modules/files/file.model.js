import {mysql} from "../../config/connections"
import {Sequelize} from "sequelize"

const FileSchema = (connection, type) => {
  return connection.define(
    "files",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      filename: {
        type: type.STRING,
        allowNull: false,
      },
      mimetype: {
        type: type.STRING,
        allowNull: false,
      },
      path: {
        type: type.STRING,
        allowNull: false,
        unique: true,
        get() {
          return process.env.HOST + "/api" + this.getDataValue("path")
        },
      },
      group: {
        type: type.STRING,
        allowNull: true,
      },
      sizes: {
        type: type.STRING,
        allowNull: true,
        get() {
          const sizes = this.getDataValue("sizes")
          return sizes && sizes.split(',')
        },
      },
      destination: {
        type: type.STRING,
        allowNull: true,
      },
      uploadBy: {
        type: type.BIGINT
      }
    },
  )
}

const FileModel = FileSchema(mysql, Sequelize)

export default FileModel
