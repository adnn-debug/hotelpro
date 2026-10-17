// Load secrets from the .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Allow the React app to call this server
app.use(cors());

// Let the server read JSON sent in requests
app.use(express.json());

// Connect to MongoDB using the address in .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
// Use the auth routes
app.use("/api/auth", require("./routes/authRoutes"));
// Use the room routes
app.use("/api/rooms", require("./routes/roomRoutes"));
// Use the booking routes
app.use("/api/bookings", require("./routes/bookingRoutes"));
// Test route
app.get("/", (req, res) => {
  res.send("HotelPro server is running");
});

app.listen(8001, () => {
  console.log("Server running on http://localhost:8001");
});