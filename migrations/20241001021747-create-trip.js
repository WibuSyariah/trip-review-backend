"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Trips", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      passenger: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      destination: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      location: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      purpose: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      startDateTime: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      endDateTime: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      reviewStatus: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      driverId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: "Drivers" },
          key: "id",
        },
      },
      carId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: "Cars" },
          key: "id",
        },
      },
      companyId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: "Companies" },
          key: "id",
        },
      },
      divisionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: "Divisions" },
          key: "id",
        },
      },
      eMoneyId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: "EMoneys" },
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Trips");
  },
};
