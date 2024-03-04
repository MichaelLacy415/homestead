'use strict';

const { Review } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        review: "this place is amazing",
        stars: 4,
        userId: 2,
        spotId: 1
      },
      {
        review: "place is horrible",
        stars: 1,
        userId: 3,
        spotId: 1
      },
      {
        review: "amazing",
        stars: 5,
        userId: 1,
        spotId: 2
      },
      {
        review: "Best place ive ever been too",
        stars: 4,
        userId: 3,
        spotId: 2
      },
      {
        review: "CHIEF KINGDOM!!!!!!",
        stars: 4,
        userId: 3,
        spotId: 3
      },
      {
        review: "cant stand the chiefs",
        stars: 3,
        userId: 2,
        spotId: 3
      },
      {
        review: "W",
        stars: 5,
        userId: 1,
        spotId: 3
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
    }, {});
  }
};
