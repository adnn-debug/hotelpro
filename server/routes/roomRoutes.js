const express = require("express");
const router = express.Router();
const { addRoom, getRooms, removeRoom } = require("../controllers/roomController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Only a logged-in admin can add a room
router.post("/addroom", verifyToken, isAdmin, addRoom);

// Only admins can remove inventory; rooms with booking history are protected.
router.delete("/:id", verifyToken, isAdmin, removeRoom);

// Anyone can view rooms
router.get("/getrooms", getRooms);

module.exports = router;