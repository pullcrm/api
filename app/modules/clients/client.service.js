import {Op, QueryTypes} from 'sequelize'
import { mysql } from '../../config/connections'
import ClientModel from './client.model'

export default {
  findByPhoneOrName: async ({companyId, limit, offset, phone, fullName}) => {
    const where = {companyId}

    if(phone || fullName) {
      where[Op.or] = [
        {phone: {[Op.like]: `%${phone}%`}},
        {fullName: {[Op.like]: `%${fullName}%`}},
      ]
    }

    const data = await ClientModel.findAll({where, limit, offset})

    return {
      pagination: {
        limit,
        offset,
      },

      data
    }
  },

  index: async ({companyId, limit, offset}) => {
    const where = `where cl.companyId = ${companyId}`

    // if (startDate && endDate) {
    //   whereConditions = whereConditions.concat(
    //     " and ",
    //     `ap.date between '${startDate}' and '${endDate}'`
    //   )
    // }

    const [data] = await mysql.query(
      ` 
     select fullName from clients as cl
     left join appointments as app on cl.id = app.clientId
     ${where}
    `,
      {type: QueryTypes.SELECT}
    )

    return {
      pagination: {
        limit,
        offset,
      },
  
      data
    }
  },

  create: async (data, {companyId}) => {
    const client = await ClientModel.create({...data, companyId})
    return client
  }
}
