import {mysql} from "../../../config/connections"
import {Sequelize} from "sequelize"

const OrderSchema = (connection, type) => {
  return connection.define('orders', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: type.DOUBLE(10,2),
      allowNull: false
    },
    paymentId: {
      type: type.STRING,
      allowNull: true
    },
    status: {
      type: type.STRING,
      allowNull: false
    },
  })
}

const OrderModel = OrderSchema(mysql, Sequelize)

export default OrderModel
