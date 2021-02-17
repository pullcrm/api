'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'procedures',
        'procedureCategoryId',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        {transaction}
      )

      await queryInterface.addConstraint('procedures', ['procedureCategoryId'], {
        type: 'foreign key',
        name: 'procedure_categories_ibfk_2',
        references: {
          table: 'procedure_categories',
          field: 'id',
        },
        transaction
      })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('procedures', 'procedureCategoryId', {transaction})
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
