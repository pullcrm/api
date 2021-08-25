'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint(
        'appointments',
        'appointments_ibfk_3',
        {transaction}
      )

      await queryInterface.addConstraint('appointments', ['specialistId'], {
        type: 'foreign key',
        name: 'appointments_ibfk_3',
        references: {
          table: 'specialists',
          field: 'id',
        },
        onDelete: 'SET NULL',
        transaction
      })

      await queryInterface.removeConstraint(
        'time_offs',
        'time_offs_ibfk_1',
        {transaction}
      )

      await queryInterface.addConstraint('time_offs', ['specialistId'], {
        type: 'foreign key',
        name: 'time_offs_ibfk_1',
        references: {
          table: 'specialists',
          field: 'id',
        },
        onDelete: 'CASCADE',
        transaction
      })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}