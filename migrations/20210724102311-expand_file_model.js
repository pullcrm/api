'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'files',
        'destination',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'files',
        'sizes',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
         
        },
        {transaction}
      )

      await queryInterface.addColumn(
        'files',
        'uploadBy',
        {
          type: Sequelize.DataTypes.BIGINT,
        },
        {transaction}
      )

      await queryInterface.addConstraint('files', ['uploadBy'], {
        type: 'foreign key',
        name: 'upload_by_ibfk_2',
        references: {
          table: 'users',
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
     
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}