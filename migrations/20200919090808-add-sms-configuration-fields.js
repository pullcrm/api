'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'sms_configurations',
        'remindAfterCreation',
        {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'sms_configurations',
        'beforeTime',
        {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'sms_configurations',
        'remindBeforeTime',
        {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        {transaction}
      )
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('sms_configurations', 'remindBeforeTime', {transaction})
      await queryInterface.removeColumn('sms_configurations', 'beforeTime', {transaction})
      await queryInterface.removeColumn('sms_configurations', 'remindAfterCreation', {transaction})
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
};
