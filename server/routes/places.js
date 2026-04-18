const express = require("express");
const router = express.Router();

const Place = require("../models/Place");

// GET ALL places
router.get("/", async (req, res) => {
  const places = await Place.find({ status: "approved" });
  res.json(places);
});

router.post("/", async (req, res) => {
  try {
    const { name, slug, image, description, createdBy } = req.body;

    console.log("BODY:", req.body);

    // 🚨 FIX HERE
    if (!name || !slug || !image) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const place = new Place({
      name,
      slug,
      image,
      description,
      createdBy,
      status: "pending",
    });

    await place.save();

    res.json({ message: "Submitted for approval ⏳" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/pending", async (req, res) => {
  const places = await Place.find({ status: "pending" });
  res.json(places);
});

router.post("/approve/:id", async (req, res) => {
  await Place.findByIdAndUpdate(req.params.id, {
    status: "approved",
  });

  res.json({ message: "Approved ✅" });
});

router.delete("/reject/:id", async (req, res) => {
  await Place.findByIdAndDelete(req.params.id);

  res.json({ message: "Rejected ❌" });
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

// ❌ DELETE ANY place (admin)
router.delete("/delete/:id", async (req, res) => {
  try {
    console.log("DELETE HIT ID:", req.params.id);

    const deleted = await Place.findByIdAndDelete(req.params.id);

    console.log("DELETED:", deleted);

    if (!deleted) {
      return res.status(404).json({ message: "Place not found ❌" });
    }

    res.json({ message: "Place deleted 🗑️" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Error deleting place" });
  }
});

module.exports = router;
