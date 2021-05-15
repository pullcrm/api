'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'company_settings',
        'creationSMSTemplate',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'company_settings',
        'remindSMSTemplate',
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
      await queryInterface.removeColumn('company_settings', 'creationSMSTemplate', {transaction})
      await queryInterface.removeColumn('company_settings', 'remindSMSTemplate', {transaction})
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
