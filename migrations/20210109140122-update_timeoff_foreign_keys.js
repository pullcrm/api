'use strict'

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.renameColumn(
        'time_offs',
        'employeeId',
        'specialistId',
        {transaction}
      )

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
        transaction
      })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.renameColumn(
        'time_offs',
        'specialistId',
        'employeeId',
        {transaction}
      )

      await queryInterface.removeConstraint(
        'time_offs',
        'time_offs_ibfk_1',
        {transaction}
      )

      await queryInterface.addConstraint('time_offs', ['employeeId'], {
        type: 'foreign key',
        name: 'time_offs_ibfk_1',
        references: {
          table: 'users',
          field: 'id',
        },
        transaction
      })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
