'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'companies',
        'typeId',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        {transaction}
      )

      await queryInterface.addConstraint('companies', ['typeId'], {
        type: 'foreign key',
        name: 'type_ibfk_1',
        references: {
          table: 'types',
          field: 'id',
        },
        transaction
      })

      await queryInterface.removeColumn('companies', 'categoryId', {transaction})

      await queryInterface.addColumn(
        'categories',
        'type',
        {
          type: Sequelize.DataTypes.STRING,
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'categories',
        'companyId',
        {
          type: Sequelize.DataTypes.BIGINT,
        },
        {transaction}
      )

      await queryInterface.addConstraint('categories', ['companyId'], {
        type: 'foreign key',
        name: 'company_ibfk_5',
        references: {
          table: 'companies',
          field: 'id',
        },
        transaction
      })

      await queryInterface.removeColumn('procedures', 'procedureCategoryId', {transaction})

      await queryInterface.addColumn(
        'procedures',
        'categoryId',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        {transaction}
      )

      await queryInterface.addConstraint('procedures', ['categoryId'], {
        type: 'foreign key',
        name: 'category_ibfk_2',
        references: {
          table: 'categories',
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
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('companies', 'typeId', {transaction})
      await queryInterface.removeColumn('categories', 'type', {transaction})
      await queryInterface.removeColumn('categories', 'companyId', {transaction})
      await queryInterface.removeColumn('procedures', 'categoryId', {transaction})

      await queryInterface.addColumn(
        'companies',
        'categoryId',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        {transaction}
      )

      await queryInterface.addConstraint('companies', ['categoryId'], {
        type: 'foreign key',
        name: 'category_ibfk_1',
        references: {
          table: 'categories',
          field: 'id',
        },
        transaction
      })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
