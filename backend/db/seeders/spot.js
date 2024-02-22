'use strict';

const { Spot } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123
      },
      {
        ownerId: 2,
        address: "123 Arkansas Lane",
        city: "Rogers",
        state: "Arkansas",
        country: "United States of America",
        lat:  36.333412,
        lng: -94.125809,
        name: "Home",
        description: "Most beautiful place on earth",
        price: 400
      },
      {
        ownerId: 3,
        address: "123 Arrowhead Lane",
        city: "Kansas City",
        state: "Missouri",
        country: "United States of America",
        lat: 39.048786,
        lng: -94.484566,
        name: "Arrowhead Stadium",
        description: "The Kingdom",
        price: 5000
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: {[Op.in]: [1,2,3]}
    }, {});
  }
};
