'use strict';

const { Reviewimage } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await Reviewimage.bulkCreate([
      {
        reviewId: 1,
        url: "https://marriedwithwanderlust.com/wp-content/uploads/2017/10/Golden-Gate-Bridge-San-Francisco-California-e1574294918981.jpeg"
      },
      {
        reviewId: 3,
        url: "https://i0.wp.com/dronesoverarkansas.com/wp-content/uploads/2018/06/33675046_10100547136516908_8369523540453490688_n.jpg?fit=960%2C540&ssl=1"
      },
      {
        reviewId: 5,
        url: "https://blog.ticketmaster.com/wp-content/uploads/AP_95090701875.jpg"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviewimages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      
    }, {});
  }
};
