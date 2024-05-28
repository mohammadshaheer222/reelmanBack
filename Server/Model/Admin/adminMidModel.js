const mongoose = require("mongoose");

const adminMidSchema = new mongoose.Schema({
  midAvatar: {
    type: String,
    required: [true, "Must Provide One Or More Files"],
  },
});

module.exports = mongoose.model("mid-avatar", adminMidSchema);
