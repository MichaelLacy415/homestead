'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, {foreignKey: 'userId'});
      Review.belongsTo(models.Spot, {foreignKey: 'spotId'});
      Review.hasMany(models.Reviewimage, {foreignKey: 'reviewId'})
    }
  };
  
  Review.init({
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};