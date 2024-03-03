const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');




module.exports = {



validateSignup: [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage("Invalid email"),
    check('username')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage("Username is required"),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage("First Name is required"),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage("Last Name is required"),
    handleValidationErrors
  ],


validateLogin: [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("Email or username is required"),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage("Password is required"),
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
    .isFloat({min: 0})
    .notEmpty()
    .withMessage("Price per day must be a positive number"),
    handleValidationErrors
],


validateQueryParams: [
    check('page')
      .optional()
      .isInt({gt: 0})
      .withMessage("Page must be greater than or equal to 1"),
    check('size')
      .optional()
      .isInt({gt: 0})
      .withMessage("Size must be greater than or equal to 1"),
    check('maxLat')
      .optional()
      .isFloat({min: -90, max: 90})
      .withMessage("Maximum latitude is invalid"),
    check('minLat')
      .optional()
      .isFloat({min: -90, max: 90})
      .withMessage("Minimum latitude is invalid"),
    check('minLng')
      .optional()
      .isFloat({min: -180, max: 180})
      .withMessage("Minimum longitude is invalid"),
    check('maxLng')
      .optional()
      .isFloat({min: -180, max: 180})
      .withMessage("Maximum longitude is invalid"),
    check('minPrice')
      .optional()
      .isFloat({min: 0})
      .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
      .optional()
      .isFloat({min: 0})
      .withMessage("Maximum price must be greater than or equal to 0"),
      handleValidationErrors
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