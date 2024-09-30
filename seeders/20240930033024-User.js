"use strict";

require("dotenv").config();
const env = process.env;
const { fn } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
const { Role } = require("../constants/enums");


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "admin",
        password: hashPassword(env.ADMIN_PASSWORD),
        role: Role.ADMIN,
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
