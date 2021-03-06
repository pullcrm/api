import {QueryTypes} from 'sequelize'
import {mysql} from '../../config/connections'

export default {
  getFinancialAnalytics: async ({startDate, endDate, specialistId}, params) => {
    let whereConditions = `where ap.companyId = ${params.companyId} and ap.status = 'COMPLETED'`

    if(startDate && endDate) {
      whereConditions = whereConditions.concat(' and ', `ap.date between '${startDate}' and '${endDate}'`)
    }

    if(specialistId) {
      whereConditions = whereConditions.concat(' and ', `ap.specialistId = '${specialistId}'`)
    }

    const procedures = await mysql.query(`
        select
            pr.id,
            pr.name,
            pr.price,
            count(ap.id) as appointmentCount,
            sum(ap.total) as income,
            sum(ap.source != 'WIDGET' or ap.source is null) as offlineCount,
            sum(ap.source = 'WIDGET') as onlineCount
        from procedures as pr
        left join appointment_procedures as app on pr.id = app.procedureId
        left join appointments as ap on app.appointmentId = ap.id
        ${whereConditions}
        group by pr.id
    `, {type: QueryTypes.SELECT})

    const [stats] = await mysql.query(`
        select
        sum(ap.total) as income,
        count(ap.id) as count,
        avg(ap.total) as avg
        from appointments as ap
        ${whereConditions}
    `, {type: QueryTypes.SELECT})

    return {
      ...stats,
      procedures
    }
  },
}
