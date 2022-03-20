import RoleModel from "./models/balance"
import ApiException from "../../exceptions/api"
import LiqPay from '../../providers/liqpay'
import OrderModel from "./models/order"
import {IN_PROGRESS} from "../../constants/balance"
import UserModel from "../users/user.model"

const public_key = process.env.LIQPAY_PUBLIC_KEY
const private_key = process.env.LIQPAY_PRIVATE_KEY

const liqpay = new LiqPay(public_key, private_key)

export default {
  checkout: async (data, params) => {
    const user = await UserModel.findOne({where: {id: params.userId}})
    const paymentId = Date.now() + user.id

    const order = await OrderModel.create({
      amount: data.amount,
      userId: user.id,
      status: IN_PROGRESS,
      paymentId
    })
  
    const html = liqpay.cnb_form({
      public_key,
      version: '3',
      action: 'pay',
      amount: order.amount,
      currency: 'UAH',
      description: `Поповнення рахунку на <strong>pullcrm.com</strong>`,
      product_description: `Зарахування коштів на рахунок ${user.fullName}`,
      order_id: order.paymentId,
      server_url: process.env.LIQPAY_REDIRECT_URL,
      result_url: `${process.env.CLIENT}/dashboard`,
    })

    return html
  },

  getPaymentInfo: async ({data, signature}) => {
    const compSignature = liqpay.str_to_sign(private_key + data + private_key)

    if (signature === compSignature) {
      const buff = Buffer.from(data, 'base64')
      let text = buff.toString('utf-8')
      text = JSON.parse(text)

      const {
        status,
        amount,
        order_id,
      } = text

      console.log(text)

      const order = await OrderModel.findOne({where: {paymentId: order_id}})

      if(!order || order.status !== IN_PROGRESS || order.amount !== amount) {
        throw new ApiException(500, 'Order wasn\'t found')
      }
  
      await order.update({status: status.toUpperCase()})
      return 'success'
    }
  
    return 'cancel'
  }
}
