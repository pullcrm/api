'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'procedures',
        'order',
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
      await queryInterface.removeColumn('procedures', 'order', {transaction})
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
