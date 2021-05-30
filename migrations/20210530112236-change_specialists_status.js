'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.changeColumn(
        'specialists',
        'status',
        {
          type: Sequelize.DataTypes.STRING,
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

