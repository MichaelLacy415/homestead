'use strict';

const { Booking } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        userId: 1,
        spotId: 1,
        startDate: new Date('2024-02-22'),
        endDate: new Date('2024-02-25')
      },
      {
        userId: 2,
        spotId: 2,
        startDate: new Date('2024-08-22'),
        endDate: new Date('2024-08-25')
      },
      {
        userId: 3,
        spotId: 3,
        startDate: new Date('2024-05-22'),
        endDate: new Date('2024-05-25')
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
