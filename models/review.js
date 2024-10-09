"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Trip, { foreignKey: "tripId" });
    }
  }
  Review.init(
    {
      rating: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      feedback: {
        type: DataTypes.TEXT,
      },
      tripId: {
        allowNull: false,
        type: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "Review",
    },
  );
  return Review;
};
