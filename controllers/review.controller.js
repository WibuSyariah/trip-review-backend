const { Review, Trip, Driver, sequelize } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../helpers/appError");

class TripController {
  static async create(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { tripId } = req.body;

      const trip = await Trip.findByPk(tripId);

      if (!trip) {
        throw new AppError("Trip not found", 404);
      }

      if (trip.reviewStatus) {
        throw new AppError("Trip already reviewed", 400);
      }

      const review = await Review.create(
        {
          ...req.body,
        },
        {
          transaction,
        },
      );

      await trip.update(
        {
          reviewStatus: true,
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      res.status(201).json({
        message: "Review created",
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  static async readAll(req, res, next) {
    try {
      const { limit, currentPage, driverId, startDate, endDate } = req.query;

      const where = {
        ...(startDate &&
          endDate && {
            createdAt: {
              [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`],
            },
          }),
        driverId,
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
            model: Review,
            attributes: ["rating", "feedback"],
            required: true,
          },
          {
            model: Driver,
            attributes: ["name"],
          },
        ],
      };

      const trip = await Trip.findAndCountAll(options);

      res.status(200).json({
        message: "Review list",
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
}

module.exports = TripController;
