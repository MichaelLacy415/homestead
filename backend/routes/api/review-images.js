const express = require('express');
const {requireAuth} = require('../../utils/auth');
const { Spot, Review, Spotimage, User, Booking, Reviewimage, Sequelize } = require('../../db/models');
const router = express.Router();



router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const reviewImage = await Reviewimage.findOne({ 
        where: { id: imageId },
        include: Review
    });

        if (!reviewImage || imageId === null) {
            return res.status(404).json({ message: "Review image couldn't be found" });
        }

        if (reviewImage.Review.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        
        await reviewImage.destroy();

        res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;