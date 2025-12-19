const Place = require("../models/place");
const Review = require("../models/review");
const asyncWrap = require("../utils/asyncWrap");
const { reviewSchema } = require("../schemas/reviews");
const ErrorHandler = require("../utils/ErrorHandler");

const express = require("express");
const isValidObjectId = require("../middleware/isValidObjectId");
const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    return next(new ErrorHandler(msg, 400));
  }
  next();
};

router.post(
  "/",
  isValidObjectId("/places"),
  validateReview,
  asyncWrap(async (req, res) => {
    const { place_id } = req.params;
    const review = new Review(req.body.review);
    const place = await Place.findById(place_id);
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash("success_msg", "Review added successfully");
    res.redirect(`/places/${place_id}`);
  })
);

router.delete(
  "/:review_id",
  isValidObjectId("/places"),
  asyncWrap(async (req, res) => {
    const { place_id, review_id } = req.params;
    await Place.findByIdAndUpdate(place_id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash("success_msg", "Review deleted successfully");
    res.redirect(`/places/${place_id}`);
  })
);

module.exports = router;
