'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'appointments',
        'status',
        {
          type: Sequelize.DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELED'),
          allowNull: false,
          defaultValue: 'IN_PROGRESS'
        },
        {transaction}
      )
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('appointments', 'status', {transaction})
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
