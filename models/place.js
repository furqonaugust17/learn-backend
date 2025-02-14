const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Place", placeSchema);
