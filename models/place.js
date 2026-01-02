const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title can't be empty"],
  },
  price: {
    type: String,
    required: [true, "Price can't be empty"],
  },
  description: {
    type: String,
    required: [true, "Description can't be empty"],
  },
  location: {
    type: String,
    required: [true, "Location can't be empty"],
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: [
      {
        type: Number,
        required: true,
      },
    ],
  },
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

placeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Place", placeSchema);
