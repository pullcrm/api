'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'categories',
        'type',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          defaultValue: 'company'
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'categories',
        'companyId',
        {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        {transaction}
      )

      await queryInterface.addConstraint('categories', ['companyId'], {
        type: 'foreign key',
        name: 'company_ibfk_2',
        references: {
          table: 'companies',
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
      await queryInterface.removeColumn('categories', 'type', {transaction})
      await queryInterface.removeColumn('categories', 'companyId', {transaction})
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
