const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  description: String,

  status: {
    type: String,
    default: "pending",
  },

  createdBy: String,
});

module.exports = mongoose.model("Place", placeSchema);
