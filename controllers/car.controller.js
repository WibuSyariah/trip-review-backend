const { Car } = require("../models");
const AppError = require("../helpers/appError");

class CarController {
  static async create(req, res, next) {
    try {
      await Car.create({
        ...req.body,
      });

      res.status(201).json({
        message: "Car created",
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        next(new AppError(`Car name or plate number is used`, 400));
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

      const car = await Car.findAndCountAll(options);

      res.status(200).json({
        message: "Car list",
        data: {
          car: car.rows,
          totalPages: Math.ceil(car.count / Number(limit)),
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

      const car = await Car.findByPk(id);

      if (!car) {
        throw new AppError("Car not found", 404);
      }

      car.destroy();

      res.status(200).json({
        message: "Car deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CarController;
