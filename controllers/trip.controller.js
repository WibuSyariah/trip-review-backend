const {
  Trip,
  Driver,
  Car,
  Company,
  Division,
  EMoney,
  Review,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const AppError = require("../helpers/appError");

class TripController {
  static async create(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        passenger,
        destination,
        location,
        purpose,
        startDateTime,
        endDateTime,
        driverId,
        carId,
        companyId,
        divisionId,
        eMoneyId,
      } = req.body;

      const driver = await Driver.findByPk(driverId);
      if (!driver) {
        throw new AppError("Driver not found", 404);
      }

      const car = await Car.findByPk(carId);
      if (!car) {
        throw new AppError("Car not found", 404);
      }

      const company = await Company.findByPk(companyId);
      if (!company) {
        throw new AppError("Company not found", 404);
      }

      const division = await Division.findByPk(divisionId);
      if (!division) {
        throw new AppError("Division not found", 404);
      }

      const eMoney = await EMoney.findByPk(eMoneyId);
      if (!eMoney) {
        throw new AppError("EMoney not found", 404);
      }

      const trip = await Trip.create({
        passenger,
        destination,
        location,
        purpose,
        startDateTime,
        endDateTime,
        driverId,
        carId,
        companyId,
        divisionId,
        eMoneyId,
      });

      await transaction.commit();

      res.status(201).json({
        message: "Trip created",
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  static async readAll(req, res, next) {
    try {
      const {
        limit,
        currentPage,
        driverId,
        carId,
        companyId,
        divisionId,
        eMoneyId,
        startDateTime,
        endDateTime,
      } = req.query;

      const where = {
        ...(startDateTime && {
          startDateTime: {
            [Op.gte]: startDateTime,
          },
        }),
        ...(endDateTime && {
          endDateTime: {
            [Op.lte]: endDateTime,
          },
        }),
        ...(driverId
          ? {
              driverId,
            }
          : {}),
        ...(carId
          ? {
              carId,
            }
          : {}),
        ...(companyId
          ? {
              companyId,
            }
          : {}),
        ...(divisionId
          ? {
              divisionId,
            }
          : {}),
        ...(eMoneyId
          ? {
              eMoneyId,
            }
          : {}),
      };

      let options = {
        where,
        limit: limit ? Number(limit) : 20,
        offset:
          (Number(currentPage ? currentPage : 1) - 1) *
          (limit ? Number(limit) : 20),
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Driver,
            attributes: ["name"],
          },
          {
            model: Car,
            attributes: ["name", "plateNumber"],
          },
          {
            model: Company,
            attributes: ["name"],
          },
          {
            model: Division,
            attributes: ["name"],
          },
          {
            model: EMoney,
            attributes: ["name"],
          },
          {
            model: Review,
            attributes: ["rating", "feedback"]
          }
        ],
      };

      const trips = await Trip.findAndCountAll(options);

      res.status(200).json({
        message: "Trip list",
        data: {
          trips: trips.rows,
          totalPages: Math.ceil(trips.count / Number(limit)),
          currentPage: Number(currentPage),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async readOne(req, res, next) {
    try {
      const { id } = req.params;

      const trip = await Trip.findByPk(id, {
        include: [
          {
            model: Driver,
            attributes: ["name", "image"],
          },
        ],
      });

      if (!trip) {
        throw new AppError("Trip not found", 404);
      }

      res.status(200).json({
        message: "Trip detail",
        data: {
          trip,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const {
        passenger,
        location,
        hour,
        driverId,
        carId,
        divisionId,
        eMoneyId,
      } = req.body;

      let trip = await Trip.findByPk(id);

      if (!trip) {
        throw new AppError("Trip not found", 404);
      }

      await trip.update({
        passenger,
        location,
        hour,
        driverId,
        carId,
        divisionId,
        eMoneyId,
      });

      await transaction.commit();
      res.status(200).json({
        message: "Trip updated",
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const trip = await Trip.findByPk(id);

      if (!trip) {
        throw new AppError("Trip not found", 404);
      }

      if (trip.reviewStatus) {
        throw new AppError(
          "Trip has already been reviewed and cannot be deleted",
          409,
        );
      }

      trip.destroy();

      res.status(200).json({
        message: "Trip deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TripController;
