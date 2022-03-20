import RoleModel from "./models/balance"
import ApiException from "../../exceptions/api"
import LiqPay from '../../providers/liqpay'
import OrderModel from "./models/order"
import {ACCEPTED, IN_PROGRESS, CANCELED} from "../../constants/balance"
import {makeRandom} from "../../utils/make-random"
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

  getPaymentInfo: async params => {
    const order = await OrderModel.findOne({where: {paymentId: params.paymentId}})

    if(!order || order.status !== IN_PROGRESS) {
      throw new ApiException(500, 'Order wasn\'t found')
    }

    if(params.status === 'SACCESS') {
      await order.update({status: ACCEPTED})
      return 'success'
    }

    await order.update({status: CANCELED})
    return 'cancel'
  }
}
