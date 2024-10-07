const { Driver, Car, Company, Division, EMoney } = require("../models");
const AppError = require("../helpers/appError");

class DropdownController {
  static async tripForm(req, res, next) {
    try {
      const drivers = await Driver.findAll({
        attributes: ["id", "name"],
      });
      const cars = await Car.findAll({
        attributes: ["id", "name", "plateNumber"],
      });
      const companies = await Company.findAll({
        attributes: ["id", "name"],
      });
      const divisions = await Division.findAll({
        attributes: ["id", "name"],
      });
      const eMoneys = await EMoney.findAll({
        attributes: ["id", "name"],
      });

      res.status(200).json({
        message: "Trip form dropdown data",
        data: {
          drivers,
          cars,
          companies,
          divisions,
          eMoneys,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DropdownController;
