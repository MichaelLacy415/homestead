const express = require('express');
const {requireAuth} = require('../../utils/auth');
const { Spot, Review, Spotimage, User, Booking, Reviewimage, Sequelize } = require('../../db/models');
const router = express.Router();
const {dateFormat, bookingDateFormat} = require('./dateformat');
// const { Op } = require('sequelize');



router.get('/current', requireAuth, async(req, res) => {
    const userId = req.user.id; 
    const reviews = await Review.findAll({
        where: { userId: userId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [
                    {
                        model: Spotimage,
                        attributes: ['url']
                    }
                ]
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
            Spot: {
                id: review.Spot.id,
                ownerId: review.Spot.ownerId,
                address: review.Spot.address,
                city: review.Spot.city,
                state: review.Spot.state,
                country: review.Spot.country,
                lat: review.Spot.lat,
                lng: review.Spot.lng,
                name: review.Spot.name,
                price: review.Spot.price,
                previewImage: review.Spot.Spotimages && review.Spot.Spotimages.length > 0 ? review.Spot.Spotimages[0].url : ""
            },
            ReviewImages: review.Reviewimages ? review.Reviewimages.map(image => ({
                id: image.id,
                url: image.url
            })) : [],
        }));

        res.status(200).json({ Reviews: reviewsJSON });
        
})

router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const {reviewId} = req.params
    const review = await Review.findOne({
        where: {id: reviewId},
        include: [Reviewimage]
    });

    if (!review) {
      return res.status(404).json({
        message: "Review couldn't be found"
      });
    }
    
    if (review.Reviewimages && review.Reviewimages.length >= 10) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached"
      });
    }

    const newImage = await Reviewimage.create({
        reviewId: Number(reviewId),
        url: req.body.url
    });

    const newImageJSON = newImage.toJSON()
    delete newImageJSON.createdAt
    delete newImageJSON.updatedAt
    delete newImageJSON.reviewId

    res.status(200).json(newImageJSON);
})

router.put('/:reviewId', requireAuth, async(req, res) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const currentReview = await Review.findOne({ where: { id: Number(reviewId) } });
    
    
    if (!currentReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== req.user.id) {
        return res.status(403).json({
          message: "Forbidden"
        });
      }

    await currentReview.update({
      review,
      stars
    });

    const reviewJSON = {
        id: currentReview.id,
        userId: currentReview.userId,
        spotId: currentReview.spotId,
        review: currentReview.review,
        stars: currentReview.stars,
        createdAt: dateFormat(currentReview.createdAt),
        updatedAt: dateFormat(new Date(currentReview.updatedAt)),
    }

    res.status(200).json(reviewJSON);
})

router.delete('/:reviewId', requireAuth, async(req, res) => {
    const {reviewId} = req.params
    const review = await Review.findOne({where: {id: Number(reviewId)} });
    if (!review) {
        return res.status(404).json({
          message: "Review couldn't be found"
        });
      }
      
      if (review.userId !== req.user.id) {
        return res.status(403).json({
          message: "Forbidden"
        });
      }
  
      await review.destroy();
  
      res.status(200).json({
        message: "Successfully deleted"
      });
})

module.exports = router;