'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.changeColumn(
        'sms_settings',
        'smsToken',
        {
          type: Sequelize.DataTypes.STRING(400),
          allowNull: true,
         
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