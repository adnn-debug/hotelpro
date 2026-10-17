// Load secrets from the .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Room = require("./models/Room");

const app = express();

// Allow the React app to call this server
app.use(cors());

// Let the server read JSON sent in requests
app.use(express.json());

// Connect to MongoDB. For a fresh demo database, create starter rooms once.
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      await Room.insertMany([
        {
          roomNumber: "101",
          description: "Comfortable single room with essential amenities.",
          photos: [],
          type: "single",
          rent: 1500,
          count: 1,
        },
        {
          roomNumber: "201",
          description: "Spacious double room suitable for two guests.",
          photos: [],
          type: "double",
          rent: 2500,
          count: 1,
        },
        {
          roomNumber: "301",
          description: "Premium suite with extra space for a comfortable stay.",
          photos: [],
          type: "suite",
          rent: 4000,
          count: 1,
        },
      ]);
      console.log("Added 3 starter rooms to the empty database");
    }
  })
  .catch((err) => console.error("MongoDB connection or room setup error:", err));

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

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`HotelPro server running on port ${PORT}`);
});
