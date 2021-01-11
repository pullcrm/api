'use strict'

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.renameColumn(
        'appointments',
        'employeeId',
        'specialistId',
        {transaction}
      )

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
        transaction
      })

      await queryInterface.removeConstraint(
        'appointments',
        'appointments_ibfk_2',
        {transaction}
      )

      await queryInterface.addConstraint('appointments', ['clientId'], {
        type: 'foreign key',
        name: 'appointments_ibfk_2',
        references: {
          table: 'clients',
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
        'appointments',
        'specialistId',
        'employeeId',
        {transaction}
      )

      await queryInterface.removeConstraint(
        'appointments',
        'appointments_ibfk_3',
        {transaction}
      )

      await queryInterface.addConstraint('appointments', ['employeeId'], {
        type: 'foreign key',
        name: 'appointments_ibfk_3',
        references: {
          table: 'users',
          field: 'id',
        },
        transaction
      })

      await queryInterface.removeConstraint(
        'appointments',
        'appointments_ibfk_2',
        {transaction}
      )

      await queryInterface.addConstraint('appointments', ['clientId'], {
        type: 'foreign key',
        name: 'appointments_ibfk_2',
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
