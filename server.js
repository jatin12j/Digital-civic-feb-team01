const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Civix Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
