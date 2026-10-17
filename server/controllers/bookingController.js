const Booking = require("../models/Booking");
const Room = require("../models/Room");

// BOOK A ROOM: a logged-in user books a room for a date range
exports.createBooking = async (req, res) => {
  try {
    const { roomId, guestName, fromdate, todate } = req.body;

    const from = new Date(fromdate);
    const to = new Date(todate);

    // The check-out date must be after the check-in date
    if (isNaN(from) || isNaN(to) || to <= from) {
      return res.status(400).json({ message: "Invalid dates" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Count active bookings of this room that overlap the requested dates
    const overlapping = await Booking.countDocuments({
      room: roomId,
      status: "booked",
      fromdate: { $lt: to },
      todate: { $gt: from },
    });

    // If every unit of this room is already taken, reject
    if (overlapping >= room.count) {
      return res.status(400).json({ message: "Room not available for these dates" });
    }

    // Work out the number of nights and the price
    const totaldays = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
    const totalAmount = totaldays * room.rent;

    const booking = new Booking({
      room: roomId,
      user: req.user.id, // comes from the token, so users can't book as someone else
      guestName,
      fromdate: from,
      todate: to,
      totaldays,
      totalAmount,
    });
    await booking.save();

    res.status(201).json({ message: "Room booked successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// MY BOOKINGS: all bookings of the logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("room");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// CANCEL: a user cancels their own booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only the owner of the booking (or an admin) can cancel it
    if (booking.user.toString() !== req.user.id && req.user.type !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ALL BOOKINGS: for the admin dashboard
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("room").populate("user", "name email phone");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};