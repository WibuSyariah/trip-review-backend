const { Company } = require("../models");
const AppError = require("../helpers/appError");

class CompanyController {
  static async create(req, res, next) {
    try {
      await Company.create({
        ...req.body,
      });

      res.status(201).json({
        message: "Company created",
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        next(new AppError(`Company name is used`, 400));
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

      const divisions = await Company.findAndCountAll(options);

      res.status(200).json({
        message: "Company list",
        data: {
          divisions: divisions.rows,
          totalPages: Math.ceil(divisions.count / Number(limit)),
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

      const division = await Company.findByPk(id);

      if (!division) {
        throw new AppError("Company not found", 404);
      }

      division.destroy();

      res.status(200).json({
        message: "Company deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CompanyController;
