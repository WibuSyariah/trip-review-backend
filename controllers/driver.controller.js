const { Driver } = require("../models");
const AppError = require("../helpers/appError");

class DriverController {
  static async create(req, res, next) {
    try {
      await Driver.create({
        ...req.body,
      });

      res.status(201).json({
        message: "Driver created",
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        next(new AppError(`Driver name is used`, 400));
      }
      next(error);
    }
  }

  static async readAll(req, res, next) {
    try {
      const { limit, currentPage } = req.query;

      let options = {
        limit: limit ? Number(limit) : 20,
        offset:
          (Number(currentPage ? currentPage : 1) - 1) *
          (limit ? Number(limit) : 20),
        order: [["id", "ASC"]],
      };

      const drivers = await Driver.findAndCountAll(options);

      res.status(200).json({
        message: "Driver list",
        data: {
          drivers: drivers.rows,
          totalPages: Math.ceil(drivers.count / Number(limit)),
          currentPage: Number(currentPage),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const driver = await Driver.findByPk(id);

      if (!driver) {
        throw new AppError("Driver not found", 404);
      }

      driver.destroy();

      res.status(200).json({
        message: "Driver deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DriverController;
