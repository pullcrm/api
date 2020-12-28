'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'sms_configurations',
        'login',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'sms_configurations',
        'password',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
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
      await queryInterface.removeColumn('sms_configurations', 'login', {transaction})
      await queryInterface.removeColumn('sms_configurations', 'password', {transaction})
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
