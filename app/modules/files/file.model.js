import {mysql} from "../../config/connections"
import {Sequelize} from "sequelize"

const FileSchema = (connection, type) => {
  return connection.define('files', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    filename: {
      type: type.STRING,
      allowNull: false
    },
    mimetype: {
      type: type.STRING,
      allowNull: false,
    },
    path: {
      type: type.STRING,
      allowNull: false,
      unique: true
    }
  })
}

const FileModel = FileSchema(mysql, Sequelize)

export default FileModel
