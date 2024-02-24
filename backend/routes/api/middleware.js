const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
module.exports = {

validateSignup: [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('email')
    .custom(async value => {
      const existingUser = await Users.findUserByEmail(value);
      if (existingUser) {
        throw new Error('E-mail already in use');
        }
      }),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
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
]

}