const { User } = require("../models");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const AppError = require("../helpers/appError");
const { payloadToToken } = require("../helpers/jwt");
const { omit } = require("lodash");

class AuthController {
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      let user = await User.findOne({
        where: { username },
        attributes: ["id", "username", "role", "password"],
      });

      if (!user || !password) {
        throw new AppError("Username or password is incorrect", 401);
      }

      if (!(await comparePassword(password, user.password))) {
        throw new AppError("Username or password is incorrect", 401);
      }

      user = omit(user.get(), ["password"]);

      const accessToken = payloadToToken(user);

      res.status(200).json({
        message: "Login success",
        data: {
          accessToken,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { id } = req.user;
      const { newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        throw new AppError("Passwords do not match", 400);
      }

      const hashedPassword = hashPassword(newPassword);

      await User.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            id,
          },
        },
      );

      res.status(200).json({
        message: "Password changed",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
