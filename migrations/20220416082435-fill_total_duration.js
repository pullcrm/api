'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {

      await queryInterface.sequelize.query(
        `
        UPDATE appointments AS b1, (SELECT app.id, sum(pr.duration) as sumDuration FROM appointments app
                  INNER JOIN appointment_procedures a_p ON app.id = a_p.appointmentId
                  INNER JOIN procedures pr ON a_p.procedureId = pr.id
                  GROUP BY a_p.appointmentId) as b2
        SET b1.totalDuration = b2.sumDuration
        WHERE b1.id = b2.id;`
      ),

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
