'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.renameTable(
        'approaches',
        'specialists',
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
      await queryInterface.renameTable(
        'specialists',
        'approaches',
        {transaction}
      )
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
