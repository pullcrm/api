'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'users',
        'fullName',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
        {transaction}
      )

      await queryInterface.sequelize.query(
        'UPDATE users SET fullName = CONCAT_WS(" ", firstName, lastName);'
      ),

      await queryInterface.removeColumn('users', 'firstName'),
      await queryInterface.removeColumn('users', 'lastName')

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