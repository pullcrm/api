module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.renameTable(
        'sms_configurations',
        'company_settings',
        {transaction}
      )

      await queryInterface.renameColumn(
        'company_settings',
        'token',
        'smsToken',
        {transaction}
      )

      await queryInterface.renameColumn(
        'company_settings',
        'remindBefore',
        'hasRemindSMS',
        {transaction}
      )

      await queryInterface.renameColumn(
        'company_settings',
        'remindAfterCreation',
        'hasCreationSMS',
        {transaction}
      )

      await queryInterface.renameColumn(
        'company_settings',
        'remindBeforeInMinutes',
        'remindSMSMinutes',
        {transaction}
      )

      await queryInterface.removeColumn('company_settings', 'login', {transaction})
      await queryInterface.removeColumn('company_settings', 'password', {transaction})

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.renameTable(
        'company_settings',
        'sms_configurations',
        {transaction}
      )

      await queryInterface.renameColumn(
        'sms_configurations',
        'smsToken',
        'token',
        {transaction}
      )

      await queryInterface.renameColumn(
        'sms_configurations',
        'hasRemindSMS',
        'remindBefore',
        {transaction}
      )

      await queryInterface.renameColumn(
        'sms_configurations',
        'hasCreationSMS',
        'remindAfterCreation',
        {transaction}
      )

      await queryInterface.renameColumn(
        'sms_configurations',
        'remindSMSMinutes',
        'remindBeforeInMinutes',
        {transaction}
      )

      await queryInterface.addColumn(
        'sms_configurations',
        'login',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: false
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'sms_configurations',
        'password',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: false
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
