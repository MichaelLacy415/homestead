const router = require('express').Router();
const spotRouter = require('./spots.js')
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const bookingRouter = require('./bookings.js')
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use('/spots', spotRouter)

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/bookings', bookingRouter)



router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
