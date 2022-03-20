import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const OrderSchema = (connection, type) => {
  return connection.define('orders', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: type.NUMERIC,
      allowNull: false
    },
    paymentId: {
      type: type.STRING,
      allowNull: false
    },
    status: {
      type: type.STRING,
      allowNull: false
    },
  })
}

const OrderModel = OrderSchema(mysql, Sequelize)

export default OrderModel
