'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reviewimage extends Model {
    
    static associate(models) {
      Reviewimage.belongsTo(models.Review, {foreignKey: 'reviewId'})
    }
  }

  Reviewimage.init({
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Reviewimage',
  });
  return Reviewimage;
};