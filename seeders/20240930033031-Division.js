"use strict";

const { fn } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Divisions", [
      {
        name: "IT",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "OPERATIONAL",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "HUMAN CAPITAL",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "FINANCE",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "TAX & ACCOUNTING",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "PROCUREMENT",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "COMMERCIAL",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "LEGAL",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Divisions", null, {});
  },
};
