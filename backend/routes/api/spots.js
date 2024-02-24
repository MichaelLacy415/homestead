const express = require('express');
const { setTokenCookie, restoreUser, requireAuth} = require('../../utils/auth');
const { Spot, Review, Spotimage, User, Sequelize } = require('../../db/models');
const router = express.Router();
const {dateFormat} = require('./dateformat');
const { where } = require('sequelize');
const {handleValidationErrors} = require('../../utils/validation');
const { validateSpot } = require('./middleware');

router.get('/', async(req, res) => {
  const spots = await Spot.findAll();
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
  
  res.status(200).json({ Spots: formattedSpots });
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
    try {
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
    } catch (err) {
      console.error(err);
      res.status(400).send({
        message: 'Bad Request'
      });
    }
  });



router.post('/:spotId/images', requireAuth, validateSpot, async (req, res, next) => {
  try {
    const {spotId} = req.params
    const { url, preview } = req.body;
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
} catch (error) {
    if (error.status === 404) {
        res.status(404).json({
            message: "Spot couldn't be found"
        });
    }
    else {
        next(error);
    }
  }
});

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findOne({ where: { id: Number(spotId) } });
  try {
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
  } catch (error) {
        next(error);
    }
});

router.delete('/:spotId', requireAuth, async (req, res) => {
    const {spotId} = req.params
    const spot = await Spot.findOne({where: {id: Number(spotId)} });

    try {
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
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


module.exports = router;