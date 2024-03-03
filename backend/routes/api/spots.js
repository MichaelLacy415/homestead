const express = require('express');
const {requireAuth} = require('../../utils/auth');
const { Spot, Review, Spotimage, User, Booking, Reviewimage, Sequelize } = require('../../db/models');
const router = express.Router();
const {dateFormat, bookingDateFormat} = require('./dateformat');
const { validateSpot, validateReview, validateQueryParams } = require('./middleware');
const { Op } = require('sequelize');


router.get('/', validateQueryParams, async(req, res) => {
  const page = Number(req.query.page) || 1;
  const size = Number(req.query.size) || 20;
  const minLat = req.query.minLat;
  const maxLat = req.query.maxLat;
  const minLng = req.query.minLng;
  const maxLng = req.query.maxLng;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  const offset = (page - 1) * size;
  const limit = size;

  const where = {};
  if (minLat) where.lat = { [Op.gte]: minLat };
  if (maxLat) where.lat = { ...where.lat, [Op.lte]: maxLat };
  if (minLng) where.lng = { [Op.gte]: minLng };
  if (maxLng) where.lng = { ...where.lng, [Op.lte]: maxLng };
  if (minPrice) where.price = { [Op.gte]: minPrice };
  if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };

  
  const spots = await Spot.findAll({where, offset, limit});
  const formattedSpots = [];
  
  for (const spot of spots) {
    const spotJSON = spot.toJSON();
    const reviews = await Review.findAll({ where: { spotId: spot.id } });
    const avgRating = reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length;
    const spotImage = await Spotimage.findOne({ where: { spotId: spot.id } });
    
    spotJSON.avgRating = avgRating;
    spotJSON.previewImage = spotImage ? spotImage.url : null;
    spotJSON.createdAt = dateFormat(new Date(spot.createdAt));
    spotJSON.updatedAt = dateFormat(new Date(spot.updatedAt));
    
    formattedSpots.push(spotJSON);
  }
  
  res.status(200).json({ Spots: formattedSpots , page, size });
});

router.get('/current', requireAuth, async(req, res) => {
    const userSpots = await Spot.findAll({
      where: {
        ownerId: req.user.id
      }
    });
    const formattedSpots = []

    for(const spot of userSpots){
    const spotJSON = spot.toJSON();
    const reviews = await Review.findAll({ where: { spotId: spot.id } });
    const avgRating = reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length;
    const spotImage = await Spotimage.findOne({ where: { spotId: spot.id } });
    
    spotJSON.avgRating = avgRating;
    spotJSON.previewImage = spotImage ? spotImage.url : null;
    spotJSON.createdAt = dateFormat(new Date(spot.createdAt));
    spotJSON.updatedAt = dateFormat(new Date(spot.updatedAt));
     
    formattedSpots.push(spotJSON);
  }
    res.status(200).json({ Spots: formattedSpots });
});

  
  router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId, {
        include: [{
          model: Spotimage,
          key: 'spotId',
          attributes: ['id', 'url', 'preview']  
        }, {
          model: User,
          key: 'id',
          attributes: ['id', 'firstName', 'lastName'], // Include these fields from the Owner model
        }],
      });
  
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
  
      const reviews = await Review.findAll({ where: { spotId: spotId } });
      const avgRating = reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length;
  
      const spotJSON = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: dateFormat(new Date(spot.createdAt)),
        updatedAt: dateFormat(new Date(spot.updatedAt)),
        numReviews: reviews.length, // Moved up
        avgRating: avgRating, // Moved up
        SpotImages: spot.Spotimages,
        Owner: spot.User
      };
  
      res.json(spotJSON);
    });

  router.post('/', requireAuth, validateSpot, async(req, res) => {
      const newSpot = await Spot.create({
        ownerId: req.user.id,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        lat: req.body.lat,
        lng: req.body.lng,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      });
      
      const spotJSON = {
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: newSpot.lat,
        lng: newSpot.lng,
        name: newSpot.name,
        description: newSpot.description,
        price: newSpot.price,
        createdAt: dateFormat(new Date(newSpot.createdAt)),
        updatedAt: dateFormat(new Date(newSpot.updatedAt)),
      }

      res.status(201).json(spotJSON);
  });



router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const {spotId} = req.params
    const { url, preview } = req.body;
    const spot = await Spot.findOne({ where: { id: Number(spotId) } });

    if(!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const newImage = await Spotimage.create({
        spotId: Number(spotId),
        url: url,
        preview: preview
    });
    res.status(200).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    });
});

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findOne({ where: { id: Number(spotId) } });
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
    
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    await spot.update({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    const spotJSON = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: dateFormat(spot.createdAt),
      updatedAt: dateFormat(new Date(spot.updatedAt)),
    }

    res.status(200).json(spotJSON);
});

router.delete('/:spotId', requireAuth, async (req, res) => {
    const {spotId} = req.params
    const spot = await Spot.findOne({where: {id: Number(spotId)} });
    if (!spot) {
        return res.status(404).json({
          message: "Spot couldn't be found"
        });
      }
      
      if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
          message: "Unauthorized"
        });
      }
  
      await spot.destroy();
  
      res.status(200).json({
        message: "Successfully deleted"
      });
  });


router.get('/:spotId/bookings', requireAuth, async(req, res) => {
    const {spotId} = req.params;
    const userBookings = await Booking.findAll({ where: { spotId: spotId } });

    const formattedBookings = [];

    for (const booking of userBookings) {
        const spot = await Spot.findOne({ where: { id: spotId } });
        const user = await User.findOne({ where: { id: spot.ownerId } });
      if(spot.ownerId !== req.user.id){
        const bookingJSON = {
                User: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                id: booking.id,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: bookingDateFormat(booking.startDate),
                endDate: bookingDateFormat(booking.endDate),
                createdAt: dateFormat(booking.createdAt),
                updatedAt: dateFormat(booking.updatedAt)
            };
            formattedBookings.push(bookingJSON);
          }
    }
    if (!formattedBookings.length) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    res.status(200).json({ Bookings: formattedBookings });
});

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const {startDate, endDate} = req.body;
  
  
  const spot = await Spot.findOne({ where: { id: spotId } });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if(spot.ownerId !== req.user.id){
  

   // Validate the request data
      if (new Date(startDate) < new Date()) {
        return res.status(400).json({
          message: "Bad Request",
          errors: {
            startDate: "startDate cannot be in the past",
            endDate: "endDate cannot be on or before startDate"
          }
        });
      }

      if (endDate < startDate) {
        return res.status(400).json({
          message: "Bad Request",
          errors: {
            startDate: "startDate cannot be in the past",
            endDate: "endDate cannot be on or before startDate"
          }
        });
      }

  const conflictingBooking = await Booking.findOne({
    where: {
      startDate: { [Op.lte]: endDate },
      endDate: { [Op.gte]: startDate }
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

  
  const booking = await Booking.create({
    spotId: Number(spotId),
    userId: req.user.id,
    startDate: startDate,
    endDate: endDate
  });

  const bookingJSON = {
    id: booking.id,
    spotId: booking.spotId,
    userId: booking.userId,
    startDate: bookingDateFormat(booking.startDate),
    endDate: bookingDateFormat(booking.endDate),
    createdAt: dateFormat(booking.createdAt),
    updatedAt: dateFormat(booking.updatedAt)
  }


  res.status(200).json(bookingJSON);
}
});

router.get('/:spotId/reviews', async(req, res) => {
  const {spotId} = req.params;

  const spot = await Spot.findOne({ where: { id: spotId } });
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const reviews = await Review.findAll({
    where: { spotId: spotId },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Reviewimage,
        attributes: ['id', 'url']
      }
    ]
  });

  const reviewsJSON = reviews.map(review => ({
    id: review.id,
    userId: review.userId,
    spotId: review.spotId,
    review: review.review,
    stars: review.stars,
    createdAt: dateFormat(new Date(review.createdAt)),
    updatedAt: dateFormat(new Date(review.updatedAt)),
    User: {
      id: review.User.id,
      firstName: review.User.firstName,
      lastName: review.User.lastName
    },
    ReviewImages: review.Reviewimages.map(image => ({
      id: image.id,
      url: image.url
    }))
  }));

  res.status(200).json({ Reviews: reviewsJSON });
});


router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res) => {
  const {spotId} = req.params
  const {stars, review} = req.body

  const spot = await Spot.findOne({ where: { id: spotId } });
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const existingReview = await Review.findOne({ where: { userId: req.user.id, spotId: spotId } });
  if (existingReview) {
    return res.status(500).json({ message: "User already has a review for this spot" });
  }
  
  const newReview = await Review.create ({
    review,
    stars
  });

  const reviewJSON = {
    id: newReview.id,
    userId: req.user.id,
    spotId: Number(spotId),
    review: newReview.review,
    stars: Number(newReview.stars),
    createdAt: dateFormat(new Date(newReview.createdAt)),
    updatedAt: dateFormat(new Date(newReview.updatedAt))
  }

  res.status(200).json(reviewJSON)
})

module.exports = router;