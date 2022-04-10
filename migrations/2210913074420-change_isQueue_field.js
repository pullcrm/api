'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.changeColumn(
        'appointments',
        'status',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          defaultValue: "IN_QUEUE"
        },
        {transaction}
      )

      await queryInterface.removeColumn(
        'appointments',
        'isQueue'
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'appointments',
        'isQueue',
        {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true,
        },
        {transaction}
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}