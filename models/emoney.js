"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EMoney extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Trip, { foreignKey: "eMoneyId" });
    }
  }
  EMoney.init(
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "EMoney",
      paranoid: true,
    },
  );
  return EMoney;
};
