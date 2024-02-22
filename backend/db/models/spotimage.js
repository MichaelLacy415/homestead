const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spotimage extends Model {
    static associate(models) {
      Spotimage.belongsTo(models.Spot, {foreignKey: "spotId"});
    }
  };

  Spotimage.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      defaultValue: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Spotimage',
  });
  return Spotimage;
};