'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.changeColumn('roles', 'name', {
        type: Sequelize.STRING,
        allowNull: false,
      }, {transaction})

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {

      await queryInterface.changeColumn('roles', 'name', {
        type: Sequelize.STRING,
        allowNull: false,
      }, {transaction})
  
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
