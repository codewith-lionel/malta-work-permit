const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const permitRoutes = require("./routes/permits");

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/permits", permitRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/uploads", express.static("uploads"));

// Global error handler (minimal)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
