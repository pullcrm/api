'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'appointments',
        'totalDuration',
        {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0
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
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
