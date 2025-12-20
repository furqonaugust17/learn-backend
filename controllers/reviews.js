const Place = require("../models/place");
const Review = require("../models/review");

module.exports.store = async (req, res) => {
  const { place_id } = req.params;

  const data = { ...req.body.review, author: req.user._id };
  const review = new Review(data);
  await review.save();

  const place = await Place.findById(place_id);
  place.reviews.push(review);
  await place.save();

  req.flash("success_msg", "Review added successfully");
  res.redirect(`/places/${place_id}`);
};

module.exports.destoy = async (req, res) => {
  const { place_id, review_id } = req.params;
  await Place.findByIdAndUpdate(place_id, { $pull: { reviews: review_id } });
  await Review.findByIdAndDelete(review_id);
  req.flash("success_msg", "Review deleted successfully");
  res.redirect(`/places/${place_id}`);
};
