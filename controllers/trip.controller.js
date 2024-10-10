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
const ExcelJS = require("exceljs");
const dayjs = require("dayjs");

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
        rating,
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
            attributes: ["rating", "feedback"],
            required: rating ? true : false,
            ...(rating
              ? {
                  where: {
                    rating: {
                      [Op.lte]: rating,
                    },
                  },
                }
              : {}),
          },
        ],
      };

      const trips = await Trip.findAndCountAll(options);

      const allTrips = await Trip.findAll({
        attributes: ["id"],
        where,
        include: [
          {
            model: Review,
            attributes: ["rating"],
          },
        ],
      });

      const totalRating = allTrips.reduce((sum, trip) => {
        // Check if Review exists and has a rating
        return sum + (trip.Review ? trip.Review.rating : 0);
      }, 0);

      const avgRating = allTrips.length > 0 ? totalRating / allTrips.length : 0;

      res.status(200).json({
        message: "Trip list",
        data: {
          trips: trips.rows,
          totalPages: Math.ceil(trips.count / Number(limit)),
          currentPage: Number(currentPage),
          tripCount: trips.count,
          avgRating: avgRating.toFixed(2),
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

  static async generateExcel(req, res, next) {
    try {
      const {
        driverId,
        carId,
        companyId,
        divisionId,
        eMoneyId,
        startDateTime,
        endDateTime,
        rating,
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
        attributes: [
          "id",
          "passenger",
          "destination",
          "location",
          "purpose",
          "startDateTime",
          "endDateTime",
          "reviewStatus",
        ],
        where,
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
            attributes: ["rating", "feedback"],
            required: rating ? true : false,
            ...(rating
              ? {
                  where: {
                    rating: {
                      [Op.lte]: rating,
                    },
                  },
                }
              : {}),
          },
        ],
      };

      const trips = await Trip.findAll(options);

      // Create a new workbook and worksheet

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Trips");

      worksheet.columns = [
        { header: "Trip ID", key: "id", width: 30 },
        { header: "Passenger", key: "passenger", width: 20 },
        { header: "Destination", key: "destination", width: 20 },
        { header: "Location", key: "location", width: 20 },
        { header: "Purpose", key: "purpose", width: 20 },
        { header: "Start Date & Time", key: "startDateTime", width: 20 },
        { header: "End Date & Time", key: "endDateTime", width: 20 },
        { header: "Review Status", key: "reviewStatus", width: 10 },
        { header: "Driver", key: "driver", width: 20 },
        { header: "Car", key: "car", width: 20 },
        { header: "Company", key: "company", width: 20 },
        { header: "Division", key: "division", width: 20 },
        { header: "E-Money", key: "emoney", width: 20 },
        { header: "Rating", key: "rating", width: 20 },
        { header: "Feedback", key: "feedback", width: 30 },
      ];

      // Add rows to the worksheet
      trips.forEach((trip) => {
        worksheet.addRow({
          id: trip.id,
          passenger: trip.passenger,
          destination: trip.destination,
          location: trip.location,
          purpose: trip.purpose,
          startDateTime: dayjs(trip.startDateTime).format("HH:mm DD/MM/YYYY"),
          endDateTime: dayjs(trip.endDateTime).format("HH:mm DD/MM/YYYY"),
          reviewStatus: trip.reviewStatus,
          driver: trip.Driver?.name || "",
          car: `${trip.Car?.name} - ${trip.Car?.plateNumber}` || "",
          company: trip.Company?.name || "",
          division: trip.Division?.name || "",
          emoney: trip.EMoney?.name || "",
          rating: trip.Review?.rating || "",
          feedback: trip.Review?.feedback || "",
        });
      });

      // Format the dates for the filename
      const formattedStartDate = startDateTime
        ? dayjs(startDateTime).format("DD-MM-YYYY")
        : "start";
      const formattedEndDate = endDateTime
        ? dayjs(endDateTime).format("DD-MM-YYYY")
        : "end";
      const fileName = `Trips ${formattedStartDate} to ${formattedEndDate}.xlsx`;

      // Set response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`,
      );

      // Write the workbook to the response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TripController;
