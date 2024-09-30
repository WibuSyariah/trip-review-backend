const { User, Division } = require("../models");
const AppError = require("../helpers/appError");
const { Op } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
const { Role } = require("../constants/enums");

class UserController {
  static async create(req, res, next) {
    try {
      await User.create({
        ...req.body,
      });

      res.status(201).json({
        message: "User created",
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        next(new AppError(`Email has been used`, 400));
      }

      next(error);
    }
  }

  static async readAll(req, res, next) {
    try {
      const { limit, currentPage } = req.query;

      let condition = {
        limit: limit ? Number(limit) : 20,
        offset:
          (Number(currentPage ? currentPage : 1) - 1) *
          (limit ? Number(limit) : 20),
        attributes: {
          exclude: ["password"],
        },
        order: [["id", "ASC"]],
      };

      const users = await User.findAndCountAll(condition);

      res.status(200).json({
        message: "User list",
        data: {
          users: users.rows,
          totalPages: Math.ceil(users.count / Number(limit)),
          currentPage: Number(currentPage),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { role, newPassword, confirmPassword } = req.body;

      const user = await User.findOne({
        where: { id },
        attributes: ["id", "username", "role"],
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      let hashedPassword = "";
      let updateData = {};

      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          throw new AppError("Passwords do not match", 400);
        } else {
          hashedPassword = hashPassword(newPassword);

          updateData.password = hashedPassword;
        }
      }

      await user.update(updateData);

      res.status(200).json({
        message: "User updated",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (user.role === Role.ADMIN) {
        throw new AppError("Forbidden", 403);
      }

      user.destroy();

      res.status(200).json({
        message: "User deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
