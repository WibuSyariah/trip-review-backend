const { Emoney } = require("../models");
const AppError = require("../helpers/appError");

class EmoneyController {
  static async create(req, res, next) {
    try {
      await Emoney.create({
        ...req.body,
      });

      res.status(201).json({
        message: "Emoney created",
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        next(new AppError(`Emoney name is used`, 400));
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

      const emoneys = await Emoney.findAndCountAll(options);

      res.status(200).json({
        message: "Emoney list",
        data: {
          emoneys: emoneys.rows,
          totalPages: Math.ceil(emoneys.count / Number(limit)),
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

      const emoney = await Emoney.findByPk(id);

      if (!emoney) {
        throw new AppError("Emoney not found", 404);
      }

      emoney.destroy();

      res.status(200).json({
        message: "Emoney deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmoneyController;
