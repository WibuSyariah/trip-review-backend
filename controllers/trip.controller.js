const { Trip, Driver, Car, Division, Emoney, sequelize } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../helpers/appError");

class TripController {
  static async create(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        passenger,
        location,
        hour,
        driverId,
        carId,
        divisionId,
        emoneyId,
      } = req.body;

      const driver = await Driver.findByPk(driverId);
      if (!driver) {
        throw new AppError("Driver not found", 404);
      }

      const car = await Car.findByPk(carId);
      if (!car) {
        throw new AppError("Car not found", 404);
      }

      const division = await Division.findByPk(divisionId);
      if (!division) {
        throw new AppError("Division not found", 404);
      }

      const emoney = await Emoney.findByPk(emoneyId);
      if (!emoney) {
        throw new AppError("Emoney not found", 404);
      }

      const trip = await Trip.create({
        passenger,
        location,
        hour,
        driverId,
        carId,
        divisionId,
        emoneyId,
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
        divisionId,
        emoneyId,
        startDate,
        endDate,
      } = req.query;

      const where = {
        ...(startDate &&
          endDate && {
            createdAt: {
              [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`],
            },
          }),
        driverId,
        carId,
        divisionId,
        emoneyId,
      };

      // Remove undefined or null values from the where clause
      Object.keys(where).forEach((key) => {
        if (where[key] === undefined || where[key] === null) {
          delete where[key];
        }
      });

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
            model: Division,
            attributes: ["name"],
          },
          {
            model: Emoney,
            attributes: ["name"],
          },
        ],
      };

      const trip = await Trip.findAndCountAll(options);

      res.status(200).json({
        message: "Trip list",
        data: {
          trips: trip.rows,
          totalPages: Math.ceil(trip.count / Number(limit)),
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

      const trip = await Trip.findByPk(id);

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
        emoneyId,
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
        emoneyId,
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
