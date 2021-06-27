'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'companies',
        'address',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'companies',
        'phone',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'companies',
        'description',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'companies',
        'viber',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'companies',
        'telegram',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'companies',
        'instagram',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'companies',
        'facebook',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true
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
      await queryInterface.removeColumn('companies', 'facebook', {transaction})
      await queryInterface.removeColumn('companies', 'instagram', {transaction})
      await queryInterface.removeColumn('companies', 'telegram', {transaction})
      await queryInterface.removeColumn('companies', 'viber', {transaction})
      await queryInterface.removeColumn('companies', 'description', {transaction})
      await queryInterface.removeColumn('companies', 'phone', {transaction})
      await queryInterface.removeColumn('companies', 'address', {transaction})
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
