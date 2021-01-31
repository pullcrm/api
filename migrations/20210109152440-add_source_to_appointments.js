'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'appointments',
        'source',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true
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
      await queryInterface.removeColumn('appointments', 'source', {transaction})
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
