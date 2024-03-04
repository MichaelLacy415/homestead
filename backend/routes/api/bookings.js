const express = require('express');
const { Op } = require('sequelize');
const {requireAuth} = require('../../utils/auth');
const { Spot, Review, Spotimage, User, Booking, Sequelize } = require('../../db/models');
const router = express.Router();
const {dateFormat, bookingDateFormat} = require('./dateformat');
// const { validateBooking } = require('./middleware');


router.get('/current', requireAuth, async(req, res) => {
    const userBookings = await Booking.findAll({ where: { userId: req.user.id }});

    const formattedBookings = [];

    for(const booking of userBookings){
    const spot = await Spot.findOne({where: {id: booking.spotId}})
    const spotJSON = spot.toJSON();
    delete spotJSON.createdAt;
    delete spotJSON.updatedAt;
    const spotImage = await Spotimage.findOne({ where: { spotId: spot.id } });
    spotJSON.previewImage = spotImage ? spotImage.url : null;
    

    const bookingJSON = {
        id: booking.id,
        spotId: booking.spotId,
        Spot: spotJSON,
        userId: booking.userId,
        startDate: bookingDateFormat(booking.startDate),
        endDate: bookingDateFormat(booking.endDate),
        createdAt: dateFormat(booking.createdAt),
        updatedAt: dateFormat(booking.updatedAt)

    }
     formattedBookings.push(bookingJSON);

    }

    res.status(200).json({ Bookings: formattedBookings});
  });

router.delete('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ where: { id: bookingId } });

        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        if (booking.userId !== req.user.id) {
            const spot = await Spot.findOne({ where: { id: booking.spotId } });
            if (!spot || spot.ownerId !== req.user.id) {
                return res.status(403).json({ message: "Forbidden" });
            }
        }

        if (booking.startTime <= Date.now()) {
            return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
        }

        
        await booking.destroy();

        res.status(200).json({ message: "Successfully deleted" });
});
  

router.put('/:bookingId', requireAuth, async(req, res) => {
  const {bookingId} = req.params;
  const {startDate, endDate} = req.body;

    // Fetch the booking
    const booking = await Booking.findOne({ where: { id: bookingId } });

    // Check if the booking exists
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }


    if (booking.userId !== req.user.id) {
          return res.status(403).json({ message: "Forbidden" });
      }

    // Validate the request data
    if (new Date(startDate) <= Date.now()) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          startDate: "startDate cannot be in the past",
          endDate: "endDate cannot be on or before startDate"
        }
      });
    }
  
    if (endDate <= startDate) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          startDate: "startDate cannot be in the past",
          endDate: "endDate cannot be on or before startDate"
        }
      });
    }

    // Check if the booking is in the past
    if (new Date(booking.endDate) < Date.now()) {
      return res.status(403).json({ message: "Past bookings can't be modified" });
    }

    // Check if the new dates conflict with an existing booking
    const conflictingBooking = await Booking.findOne({
      where: {
        id: {
          [Op.ne]: bookingId  // Exclude the current booking
        },
        spotId: booking.spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [new Date(startDate), new Date(endDate)]
            }
          },
          {
            endDate: {
              [Op.between]: [new Date(startDate), new Date(endDate)]
            }
          },
          {
            startDate: {
              [Op.lte]: new Date(startDate)
            },
            endDate: {
              [Op.gte]: new Date(endDate)
            }
          }
        ]
      }
    });

    if (conflictingBooking) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      });
    }

    // Update the booking
    await booking.update({
      startDate,
      endDate
    })


    const bookingJSON = {
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: bookingDateFormat(booking.startDate),
      endDate: bookingDateFormat(booking.endDate),
      createdAt: dateFormat(booking.createdAt),
      updatedAt: dateFormat(new Date(booking.updatedAt))
    }
    // Return the updated booking
    res.json(bookingJSON);

});


module.exports = router;