import {mysql} from "../../../config/connections";
import {Sequelize} from "sequelize";

const AddressSchema = (connection, type) => {
  return connection.define('addresses', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    country: {
      type: type.STRING,
      allowNull: false
    },
    city: {
      type: type.STRING,
      allowNull: false
    },
    house: {
      type: type.STRING,
      allowNull: true
    },
    zip: {
      type: type.STRING,
      allowNull: true
    }
  })
}

const AddressModel = AddressSchema(mysql, Sequelize)
export default AddressModel
