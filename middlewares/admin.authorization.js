const AppError = require("../helpers/appError");
const { Role } = require("../constants/enums");


const authorization = async (req, res, next) => {
  try {
    if (req.user.role !== Role.ADMIN) {
      return next(new AppError("Forbidden", 403));
    }
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
