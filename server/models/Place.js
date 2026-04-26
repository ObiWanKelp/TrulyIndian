const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userEmail: String,
  stars: Number,
});

const subPlaceSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  createdBy: String,

  status: {
    type: String,
    default: "pending",
  },

  ratings: [ratingSchema],

  avgRating: {
    type: Number,
    default: 0,
  },

  totalRatings: {
    type: Number,
    default: 0,
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
