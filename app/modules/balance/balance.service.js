import RoleModel from "./balance.model"
import ApiException from "../../exceptions/api"
const LiqPay = require('../../providers/liqpay')

export default {
  checkout: async (data) => {
    const liqpay = new LiqPay('sandbox_i52517703097', 'sandbox_L64W4riT2qvz7GHuoMoDQbanENZCjgu8hpYIEN7m')

    console.log(liqpay)
  
    const html = liqpay.cnb_form({
      action: "pay",
      amount: "1",
      currency: "USD",
      description: "description text",
      order_id: "order_id_1",
      version: "3",
    })

    return html
  },
}
