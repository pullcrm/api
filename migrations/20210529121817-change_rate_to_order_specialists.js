'use strict'

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.renameColumn(
        'specialists',
        'rate',
        'order',
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
      await queryInterface.renameColumn(
        'specialists',
        'order',
        'rate',
        {transaction}
      )
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
