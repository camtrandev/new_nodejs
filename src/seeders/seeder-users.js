'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'camtrandev@gmail.com',
      password: '12345',
      firstName: 'tran',
      lastName: 'cam',
      address: 'VN',
      gender: 1,
      typeRole: 'ROLE',    // thêm typerole vè keyrole để phân biệt người dùng là Amin , doctor, client
      keyRole: 'R1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
