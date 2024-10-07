"use strict";

const { fn } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Companies", [
      {
        name: "MODA GLOBAL MARITIM",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "MAZO ARMADA PASIFIK",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "AURORA TRANS PASIFIK",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "GEO TEKNO GLOBALINDO",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "UNO GLOBAL SATELIT",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Companies", null, {});
  },
};
