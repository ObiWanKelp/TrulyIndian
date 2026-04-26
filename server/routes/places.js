// server/routes/places.js

const express = require("express");
const router = express.Router();

const Place = require("../models/Place");

/* =========================
   GET ALL APPROVED PLACES
========================= */
router.get("/", async (req, res) => {
  try {
    const places = await Place.find({ status: "approved" });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   ADD MAIN PLACE
========================= */
router.post("/", async (req, res) => {
  try {
    const { name, slug, image, description, createdBy } = req.body;

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
      subplaces: [],
    });

    await place.save();

    res.json({
      message: "Submitted for approval ⏳",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   ADD SUBPLACE (PENDING)
========================= */
router.post("/subplace", async (req, res) => {
  try {
    const { parentSlug, name, image, description, createdBy } = req.body;

    if (!parentSlug || !name || !image) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const place = await Place.findOne({ slug: parentSlug });

    if (!place) {
      return res.status(404).json({
        message: "Parent place not found",
      });
    }

    place.subplaces.push({
      name,
      image,
      description,
      createdBy,
      status: "pending",
    });

    await place.save();

    res.json({
      message: "Subplace sent for approval ⏳",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   GET PENDING MAIN PLACES
========================= */
router.get("/pending", async (req, res) => {
  try {
    const places = await Place.find({
      status: "pending",
    });

    res.json(places);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   GET PENDING SUBPLACES
========================= */
router.get("/pending-subplaces", async (req, res) => {
  try {
    const places = await Place.find();

    let pending = [];

    places.forEach((place) => {
      place.subplaces.forEach((sub) => {
        if (sub.status === "pending") {
          pending.push({
            parentId: place._id,
            parentName: place.name,
            parentSlug: place.slug,

            _id: sub._id,
            name: sub.name,
            image: sub.image,
            description: sub.description,
            createdBy: sub.createdBy, // FIXED
            status: sub.status,
          });
        }
      });
    });

    res.json(pending);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   APPROVE MAIN PLACE
========================= */
router.post("/approve/:id", async (req, res) => {
  try {
    await Place.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });

    res.json({
      message: "Approved ✅",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   REJECT MAIN PLACE
========================= */
router.delete("/reject/:id", async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);

    res.json({
      message: "Rejected ❌",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   APPROVE SUBPLACE
========================= */
router.post("/approve-subplace/:placeId/:subId", async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId);

    const sub = place.subplaces.id(req.params.subId);

    if (!sub) {
      return res.status(404).json({
        message: "Subplace not found",
      });
    }

    sub.status = "approved";

    await place.save();

    res.json({
      message: "Subplace approved ✅",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   REJECT SUBPLACE
========================= */
router.delete("/reject-subplace/:placeId/:subId", async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId);

    place.subplaces.pull(req.params.subId);

    await place.save();

    res.json({
      message: "Subplace rejected ❌",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   DELETE PLACE
========================= */
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Place.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Place not found ❌",
      });
    }

    res.json({
      message: "Place deleted 🗑️",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting place",
    });
  }
});
// ADD THIS ABOVE: router.get("/:slug", ...)

/* =========================
   DELETE APPROVED SUBPLACE
========================= */
router.delete("/delete-subplace/:placeId/:subId", async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId);

    if (!place) {
      return res.status(404).json({
        message: "Place not found ❌",
      });
    }

    const subplace = place.subplaces.id(req.params.subId);

    if (!subplace) {
      return res.status(404).json({
        message: "Subplace not found ❌",
      });
    }

    place.subplaces.pull(req.params.subId);

    await place.save();

    res.json({
      message: "Subplace deleted 🗑️",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});
router.post("/rate/:placeId/:subId", async (req, res) => {
  try {
    const { userEmail, stars } = req.body;

    if (!userEmail || !stars) {
      return res.status(400).json({
        message: "Missing data",
      });
    }

    const place = await Place.findById(req.params.placeId);

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    const sub = place.subplaces.id(req.params.subId);

    if (!sub) {
      return res.status(404).json({
        message: "Subplace not found",
      });
    }

    const existing = sub.ratings.find((r) => r.userEmail === userEmail);

    if (existing) {
      existing.stars = Number(stars);
    } else {
      sub.ratings.push({
        userEmail,
        stars: Number(stars),
      });
    }

    let total = 0;

    sub.ratings.forEach((r) => {
      total += r.stars;
    });

    sub.totalRatings = sub.ratings.length;
    sub.avgRating = total / sub.totalRatings;

    await place.save();

    res.json({
      message: "Review submitted ⭐",
      avgRating: sub.avgRating,
      totalRatings: sub.totalRatings,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   GET PLACE BY SLUG
========================= */
router.get("/:slug", async (req, res) => {
  try {
    const place = await Place.findOne({
      slug: req.params.slug,
    });

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    res.json(place);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
