const express = require("express");
const router = express.Router();

const Place = require("../models/Place");

// GET ALL places
router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET place by slug
router.get("/:slug", async (req, res) => {
  try {
    const place = await Place.findOne({ slug: req.params.slug });

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json(place);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADD PLACE (admin)
router.post("/", async (req, res) => {
  try {
    const { name, slug, image, description } = req.body;

    // prevent duplicates
    const existing = await Place.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Place already exists" });
    }

    const newPlace = new Place({
      name,
      slug,
      image,
      description,
    });

    await newPlace.save();

    res.json({ message: "Place added ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding place" });
  }
});

module.exports = router;
