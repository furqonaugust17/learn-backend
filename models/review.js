const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: [true, "Rating can't be empty"],
  },
  body: {
    type: String,
    required: [true, "body can't be empty"],
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
