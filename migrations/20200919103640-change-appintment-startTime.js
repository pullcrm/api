'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.changeColumn(
        'appointments',
        'startTime',
        {
          type: Sequelize.DataTypes.TIME,
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
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.changeColumn(
        'appointments',
        'startTime',
        {
          type: Sequelize.DataTypes.TIME,
          allowNull: false,
         
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

