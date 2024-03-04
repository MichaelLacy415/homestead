const express = require('express');
const {requireAuth} = require('../../utils/auth');
const { Spot, Review, Spotimage, User, Booking, Sequelize } = require('../../db/models');
const router = express.Router();



router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const spotImage = await Spotimage.findOne({ 
        where: { id: imageId },
        include: Spot
    });

        if (!spotImage) {
            return res.status(404).json({ message: "Spot image couldn't be found" });
        }

        if (spotImage.Spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        
        await spotImage.destroy();

        res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;