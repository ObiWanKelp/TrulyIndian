require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path"); // ✅ must come before usage

console.log("Static path:", path.join(__dirname, "../public"));

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();

// ✅ connect DB FIRST
connectDB();

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use("/api/auth", authRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "API working fine 🚀" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const placeRoutes = require("./routes/places");
app.use("/api/places", placeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
