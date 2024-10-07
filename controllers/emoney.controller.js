const { EMoney } = require("../models");
const AppError = require("../helpers/appError");

class EMoneyController {
  static async create(req, res, next) {
    try {
      await EMoney.create({
        ...req.body,
      });

      res.status(201).json({
        message: "EMoney created",
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        next(new AppError(`EMoney name is used`, 400));
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

      const eMoneys = await EMoney.findAndCountAll(options);

      res.status(200).json({
        message: "EMoney list",
        data: {
          eMoneys: eMoneys.rows,
          totalPages: Math.ceil(eMoneys.count / Number(limit)),
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

      const eMoney = await EMoney.findByPk(id);

      if (!eMoney) {
        throw new AppError("EMoney not found", 404);
      }

      eMoney.destroy();

      res.status(200).json({
        message: "EMoney deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EMoneyController;
