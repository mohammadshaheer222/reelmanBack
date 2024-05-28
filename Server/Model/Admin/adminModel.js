const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Enter your Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your Password"],
    minLength: [4, "Password should be greater than 4 characters"],
    // select: false,
  },
});

adminSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACTIVATION_SECRET, {
    expiresIn: process.env.ACTIVATION_COOKIE,
  });
};

module.exports = mongoose.model("admin", adminSchema);
