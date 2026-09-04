require("dotenv").config();

// Some ISP/router DNS servers don't answer the SRV lookups that mongodb+srv:// needs.
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const pharmacyRoutes = require("./src/routes/pharmacy");
const pharmacistRoutes = require("./src/routes/pharmacist");
const authRoutes = require("./src/routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", pharmacyRoutes);
app.use("/api", pharmacistRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
