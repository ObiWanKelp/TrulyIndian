const mongoose = require("mongoose");

const subPlaceSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  createdBy: String,

  status: {
    type: String,
    default: "pending",
  },
});

const placeSchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  description: String,
  createdBy: String,

  status: {
    type: String,
    default: "pending",
  },

  subplaces: [subPlaceSchema],
});

module.exports = mongoose.model("Place", placeSchema);
