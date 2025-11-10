const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");
const permitRoutes = require("./routes/permits");

const PORT = process.env.PORT || 5000;
const uploadsDir = path.join(__dirname, "uploads");

// Ensure uploads directory exists
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created uploads directory:", uploadsDir);
  }
} catch (err) {
  console.error("Failed to create uploads directory", err);
  process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// Security & parsing middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/permits", permitRoutes);

// Health
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Serve uploads (public)
app.use("/uploads", express.static(uploadsDir));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
