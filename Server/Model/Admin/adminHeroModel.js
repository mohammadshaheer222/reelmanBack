const mongoose = require("mongoose");

const adminHeroSchema = new mongoose.Schema({
  heroAvatar: {
    type: String,
    required: [true, "Must Provide One Or More Files"],
  },

  
});

module.exports = mongoose.model("hero-avatar", adminHeroSchema);
