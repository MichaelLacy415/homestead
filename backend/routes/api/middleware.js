const { Spot, Review, Spotimage, User, Booking, Sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleBookingValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
module.exports = {

validateSignup: [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('email')
      .custom(async value => {
        const existingUser = await User.findUserByEmail(value);
          if (existingUser) {
            throw new Error('E-mail already in use');
          }
      }),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ],


validateLogin: [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ],

validateUser: [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ],

validateSpot: [
  check('address')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("Street address is required"),
  check('city')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("City is required"),
  check('state')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("State is required"),
  check('country')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("Country is required"),
  check('lat')
    .isFloat({min: -90, max: 90})
    .withMessage("Latitude must be within -90 and 90"),
  check('lng')
    .isFloat({min: -180, max: 180})
    .withMessage("Longitude must be within -180 and 180"),
  check('name')
    .isLength({max: 50})
    .notEmpty()
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("Description is required"),
  check('price')
    .exists({checkFalsy: true})
    .isInt({min: 1})
    .notEmpty()
    .withMessage("Price per day must be a positive number"),
    handleValidationErrors
],


validateQuerryParams: [
  check('startDate')
    .custom(async (value, { req }) => {
      if (new Date(value) <= new Date()) {
        throw new Error('startDate cannot be in the past');
      }
      const existingStartDateBooking = await Booking.findOne({
        where: {
          startDate: {
            [Op.between]: [new Date(value), new Date(req.body.endDate)]
          }
        }
      });
      if (existingStartDateBooking) {
        throw new Error('Start date conflicts with an existing booking');
      }
      return true;
    }),
  check('endDate')
    .custom(async (value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('endDate cannot be on or before startDate');
      }
      const existingEndDateBooking = await Booking.findOne({
        where: {
          endDate: {
            [Op.between]: [new Date(req.body.startDate), new Date(value)]
          }
        }
      });
      if (existingEndDateBooking) {
        throw new Error('End date conflicts with an existing booking');
      }
      return true;
    }),
  handleBookingValidationErrors
],

validateReview: [
    check('review')
      .exists({checkFalsy: true})
      .withMessage("Review text is required"),
    check('stars')
      .isInt({
        min: 1,
        max: 5
      })
      .withMessage("Stars must be an integer from 1 to 5"),
      handleValidationErrors
  ]
}