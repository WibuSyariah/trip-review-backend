const { Driver } = require("../models");
const AppError = require("../helpers/appError");
const fs = require("fs");
const path = require("path");

class DriverController {
  static async create(req, res, next) {
    try {
      if (!req.file) {
        throw new AppError("Please upload an image", 400);
      }

      const { name } = req.body;

      const image = `${process.env.BASE_URL}/upload/image/${req.file.filename}`;

      await Driver.create({
        name,
        image,
      });

      res.status(201).json({
        message: "Driver created",
      });
    } catch (error) {
      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../uploads/images",
          req.file.filename,
        );
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting the file:", unlinkErr);
          }
        });
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

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Find the driver by ID
      const driver = await Driver.findByPk(id);

      if (!driver) {
        throw new AppError("Driver not found", 404);
      }

      // Store the old image path for deletion if a new image is uploaded
      const oldImagePath = driver.image;

      // If a new image is uploaded, update the driver's image
      let image;
      if (req.file) {
        // Construct the new image URL
        image = `${process.env.BASE_URL}/upload/image/${req.file.filename}`;

        // Delete the old image file
        const oldFileName = oldImagePath.split("/").pop();
        const oldFullPath = path.join(
          __dirname,
          "../uploads/images",
          oldFileName,
        );

        fs.unlink(oldFullPath, (err) => {
          if (err) {
            console.error("Error deleting the old image:", err);
          }
        });
      } else {
        // Keep the old image if no new image is uploaded
        image = oldImagePath;
      }

      // Update the driver's information
      await driver.update({
        ...(name ? { name: name } : {}),
        image,
      });

      res.status(200).json({
        message: "Driver updated successfully",
      });
    } catch (error) {
      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../uploads/images",
          req.file.filename,
        );
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting the file:", unlinkErr);
          }
        });
      }
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

      const imagePath = driver.image; // Assuming the image field contains the URL
      const fileName = imagePath.split("/").pop(); // Extract the filename
      const fullPath = path.join(__dirname, "../uploads/images", fileName);

      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Error deleting the image:", err);
        }
      });

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
