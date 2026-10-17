const mongoose = require("mongoose");

// A schema describes what one user looks like in the database
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, enum: ["admin", "customer"], default: "customer" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);