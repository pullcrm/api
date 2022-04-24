import {Op, QueryTypes} from 'sequelize'
import {mysql} from '../../config/connections'
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

    const data = await ClientModel.findAll({where, limit, offset, attributes: ['id', 'fullName', 'phone']})

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
    const total = await ClientModel.count({where: {companyId}})
    const data = await mysql.query(
      ` 
      select 
        cl.id,
        cl.fullName,
        cl.email,
        cl.phone,
        cl.birthday,
        count(app.id) as visits,
        sum(app.total) as payed,
        avg(app.total) as avgPayed
      from clients as cl
        left join appointments as app on cl.id = app.clientId
      ${where}
      group by cl.id
      order by cl.id desc
      limit ${limit}
      offset ${offset}
    `,
      {type: QueryTypes.SELECT}
    )

    return {
      pagination: {
        limit,
        offset,
        total
      },
  
      data
    }
  },

  create: async (data, {companyId}) => {
    const client = await ClientModel.create({...data, companyId})
    return client
  }
}
