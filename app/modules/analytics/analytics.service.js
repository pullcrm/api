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

    // const procedures = await mysql.query(`
    //   select 
    //     procedures.id,
    //     procedures.name,
    //     procedures.price,
    //     coalesce(totals.amount, 0) as amount,
    //     coalesce(totals.income, 0) as income,
    //     coalesce(totals.offline, 0) as offline,
    //     coalesce(totals.online, 0) as online
    //   from (
    //     select
    //         pr.id,
    //         count(ap.id) as amount,
    //         convert(sum(ap.total), SIGNED INTEGER) as income,
    //         convert(sum(ap.source != 'WIDGET' or ap.source is null), SIGNED INTEGER) as offline,
    //         convert(sum(ap.source = 'WIDGET'), SIGNED INTEGER) as online
    //     from procedures as pr
    //     left join appointment_procedures as app on pr.id = app.procedureId
    //     left join appointments as ap on app.appointmentId = ap.id
    //     ${whereConditions}
    //     group by app.appointmentId
    //   ) as totals
    //   right join (
    //     select 
    //       pr.id,
    //       pr.name,
    //       pr.price
    //     from procedures as pr
    //     where pr.companyId = ${params.companyId}
    //   ) as procedures
    //   on totals.id = procedures.id
        
    // `, {type: QueryTypes.SELECT})

    const procedures = await mysql.query(`
    select 
        totals.groupName as name,
        coalesce(totals.amount, 0) as amount,
        coalesce(totals.income, 0) as totalPrice,
        coalesce(totals.offline, 0) as offline,
        coalesce(totals.online, 0) as online,
        coalesce(totals.total, 0) as actialIncome
      from (
        select
          count(pr.id) as amount,
          convert(sum(ap.total), SIGNED INTEGER) as total,
          group_concat(pr.name) as groupName,
          convert(sum(pr.price), SIGNED INTEGER) as income,
          convert(sum(ap.source != 'WIDGET' or ap.source is null), SIGNED INTEGER) as offline,
          convert(sum(ap.source = 'WIDGET'), SIGNED INTEGER) as online
        from appointment_procedures as app
        left join appointments as ap on app.appointmentId = ap.id
        left join procedures as pr on app.procedureId = pr.id
        ${whereConditions}
        group by app.appointmentId
      ) as totals

    `, {type: QueryTypes.SELECT})

    const [stats] = await mysql.query(`
        select
          coalesce(convert(sum(ap.total), SIGNED INTEGER), 0) as total,
          coalesce(count(ap.id), 0) as count,
          coalesce(round(avg(ap.total), 2), 0) as avg
        from appointments as ap
        left join appointment_procedures as app on ap.id = app.appointmentId
        left join procedures as pr on app.procedureId = pr.id
        ${whereConditions}
        
    `, {type: QueryTypes.SELECT})

    return {
      ...stats,
      procedures
    }
  },

  getCalendarAnalytics: async ({startDate, endDate, specialistId}, params) => {
    let whereConditions = `where ap.companyId = ${params.companyId}`
  
    if(startDate && endDate) {
      whereConditions = whereConditions.concat(' and ', `ap.date between '${startDate}' and '${endDate}'`)
    }

    if(specialistId) {
      whereConditions = whereConditions.concat(' and ', `ap.specialistId = '${specialistId}'`)
    }

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
        ${whereConditions} GROUP BY intrvl
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
      ${whereConditions}
    `, {type: QueryTypes.SELECT})

    return {
      ...stats,
      appointments
    }
  }
}
