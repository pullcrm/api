import {mysql} from "../../config/connections"
import {Sequelize} from "sequelize"

const CitySchema = (connection, type) => {
  return connection.define('cities', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false,
      unique: true
    },
  })
}

const CityModel = CitySchema(mysql, Sequelize)

export default CityModel
