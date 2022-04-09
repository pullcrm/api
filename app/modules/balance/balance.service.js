import sequelize from "sequelize"
import ApiException from "../../exceptions/api"
import LiqPay from "../../providers/liqpay"
import OrderModel from "./models/order"
import BalanceModel from './models/balance'
import {IN_PROGRESS, SUCCESS} from "../../constants/balance"
import UserModel from "../users/user.model"
import { mysql } from "../../config/connections"

const public_key = process.env.LIQPAY_PUBLIC_KEY
const private_key = process.env.LIQPAY_PRIVATE_KEY

const liqpay = new LiqPay(public_key, private_key)

export default {
  getBalance: async params => {
    const user = await UserModel.findOne({where: {id: params.userId}})

    if (!user) {
      throw new ApiException(404, "User wasn't found")
    }

    const balance = await BalanceModel.sum("amount", {
      where: {userId: user.id},
    })
    return {balance}
  },

  checkout: async (data, params) => {
    const user = await UserModel.findOne({where: {id: params.userId}})

    if (!user) {
      throw new ApiException(404, "User wasn't found")
    }

    const order = await OrderModel.create({
      amount: data.amount,
      userId: user.id,
      status: IN_PROGRESS,
    })

    const html = liqpay.cnb_form({
      public_key,
      version: "3",
      action: "pay",
      amount: order.amount,
      currency: "UAH",
      description: `Поповнення рахунку на pullcrm.com`,
      product_description: `Зарахування коштів на рахунок ${user.fullName}`,
      order_id: order.id,
      server_url: process.env.LIQPAY_REDIRECT_URL,
      result_url: `${process.env.CLIENT}/dashboard`,
    })

    return html
  },

  getPaymentInfo: async ({data, signature}) => {
    const compSignature = liqpay.str_to_sign(private_key + data + private_key)

    if (signature === compSignature) {
      const buff = Buffer.from(data, "base64")
      let text = buff.toString("utf-8")
      text = JSON.parse(text)

      const {status, amount, order_id, payment_id} = text

      const order = await OrderModel.findOne({
        where: {id: Number(order_id)},
      })

      if (
        !order ||
        order.status !== IN_PROGRESS ||
        Number(order.amount) !== amount
      ) {
        throw new ApiException(404, "Order wasn't found")
      }

      await mysql.transaction(async transaction => {
        await order.update({
          status: status.toUpperCase(),
          paymentId: payment_id,
        }, transaction)

        await BalanceModel.create({amount: order.amount, userId: order.userId, description: 'DEPOSIT'})
      })

      return "success"
    }

    return "cancel"
  },
}
