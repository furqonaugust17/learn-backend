const { placeSchema } = require("../schemas/places");
const ErrorHandler = require("../utils/ErrorHandler");
const { reviewSchema } = require("../schemas/reviews");

module.exports.validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    return next(new ErrorHandler(msg, 400));
  }

  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    return next(new ErrorHandler(msg, 400));
  }
  next();
};
