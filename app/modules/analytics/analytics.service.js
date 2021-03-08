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
            count(ap.id) as amount,
            convert(sum(ap.total), SIGNED INTEGER) as income,
            convert(sum(ap.source != 'WIDGET' or ap.source is null), SIGNED INTEGER) as offline,
            convert(sum(ap.source = 'WIDGET'), SIGNED INTEGER) as online
        from procedures as pr
        left join appointment_procedures as app on pr.id = app.procedureId
        left join appointments as ap on app.appointmentId = ap.id
        ${whereConditions}
        group by pr.id
    `, {type: QueryTypes.SELECT})

    const [stats] = await mysql.query(`
        select
        convert(sum(ap.total), SIGNED INTEGER) as income,
        count(ap.id) as count,
        round(avg(ap.total), 2) as avg
        from appointments as ap
        ${whereConditions}
    `, {type: QueryTypes.SELECT})

    return {
      ...stats,
      procedures
    }
  },

  getCalendarAnalytics: async ({startDate, endDate, specialistId}, params) => {
    const appointments = await mysql.query(`
    SELECT
      calendar.Date as step,
      COALESCE(amount, 0) as amount,
      COALESCE(CONVERT(inProgress, SIGNED INTEGER), 0) as inProgress,
      COALESCE(CONVERT(completed, SIGNED INTEGER), 0) as completed,
      COALESCE(CONVERT(offline, SIGNED INTEGER), 0) as offline,
      COALESCE(CONVERT(online, SIGNED INTEGER), 0) as online
    from
      (
        select
          count(ap.id) as amount,
          DATE(ap.date) as intrvl,
          sum(ap.status = 'IN_PROGRESS') as inProgress,
          sum(ap.status = 'COMPLETED') as completed,
          sum(ap.source != 'WIDGET' or ap.source is null) as offline,
          sum(ap.source = 'WIDGET') as online
        FROM appointments as ap
        WHERE ap.date between '${startDate}' and '${endDate}' GROUP BY intrvl
      ) cnt
      RIGHT JOIN
      (select a.Date
        from (
            select curdate() - INTERVAL (a.a + (10 * b.a) + (100 * c.a) + (1000 * d.a) ) DAY as Date
            from (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as a
            cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as b
            cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as c
            cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as d
        ) a
        where a.Date between '${startDate}' and '${endDate}') calendar
        on calendar.Date = cnt.intrvl
  `, {type: QueryTypes.SELECT})
    
    const [stats] = await mysql.query(`
      select
        count(ap.id) as count,
        convert(sum(ap.status = 'COMPLETED'), SIGNED INTEGER) as completed,
        convert(sum(ap.source != 'WIDGET' or ap.source is null), SIGNED INTEGER) as offline,
        convert(sum(ap.source = 'WIDGET'), SIGNED INTEGER) as online
      from appointments as ap
      where ap.date between '${startDate}' and '${endDate}'
    `, {type: QueryTypes.SELECT})

    return {
      ...stats,
      appointments
    }
  }
}
