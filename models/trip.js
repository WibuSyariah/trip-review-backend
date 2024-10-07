"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Driver, { foreignKey: "driverId" });
      this.belongsTo(models.Car, { foreignKey: "carId" });
      this.belongsTo(models.Company, { foreignKey: "companyId" });
      this.belongsTo(models.Division, { foreignKey: "divisionId" });
      this.belongsTo(models.EMoney, { foreignKey: "eMoneyId" });
      this.hasOne(models.Review, { foreignKey: "tripId" });
    }
  }
  Trip.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      passenger: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      destination: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      location: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      purpose: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      startDateTime: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      endDateTime: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      reviewStatus: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      driverId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      carId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      companyId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      divisionId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      eMoneyId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Trip",
      paranoid: true,
    },
  );
  return Trip;
};
