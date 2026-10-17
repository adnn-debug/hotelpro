const Room = require("../models/Room");

// ADD ROOM: create a new room
exports.addRoom = async (req, res) => {
  try {
    const { roomNumber, description, photos, type, rent, count } = req.body;

    const room = new Room({ roomNumber, description, photos, type, rent, count });
    await room.save();

    res.status(201).json({ message: "Room added successfully", room });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET ALL ROOMS: return every room in the database
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};