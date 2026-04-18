const express = require("express");
const router = express.Router();

const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "User registered ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

router.get("/me", async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

router.put("/update", async (req, res) => {
  const { email, name, password } = req.body;

  const updated = await User.findOneAndUpdate(
    { email },
    { name, password },
    { new: true },
  );

  res.json({ message: "Updated ✅", user: updated });
});
router.delete("/delete", async (req, res) => {
  console.log("DELETE HIT:", req.query);

  const { email } = req.query;

  await User.findOneAndDelete({ email });

  res.json({ message: "Account deleted ❌" });
});
// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful 🚀",
      role: user.role,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
