'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint(
        'procedures',
        'category_ibfk_2',
        {transaction}
      )

      await queryInterface.addConstraint('procedures', ['categoryId'], {
        type: 'foreign key',
        name: 'category_ibfk_2',
        references: {
          table: 'categories',
          field: 'id',
        },
        onDelete: 'SET NULL',
        transaction
      })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}