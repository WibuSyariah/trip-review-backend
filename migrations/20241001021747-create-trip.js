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
      location: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      hour: {
        allowNull: false,
        type: Sequelize.TIME,
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
      divisionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: "Divisions" },
          key: "id",
        },
      },
      emoneyId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: "Emoneys" },
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
