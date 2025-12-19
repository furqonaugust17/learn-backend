const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email can't be empty"],
    unique: [true, "This email has been used"],
  },
});

userSchema.plugin(passportLocalMongoose.default);
module.exports = mongoose.model("User", userSchema);
