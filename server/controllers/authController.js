const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// SIGNUP: create a new user
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, type } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, phone, type });
    await user.save();

    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN: check email and password, then give back a token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the typed password with the scrambled one in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create a token that stays valid for 1 day
    const token = jwt.sign(
      { id: user._id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
           user: { id: user._id, name: user.name, email: user.email, type: user.type },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// ALL USERS: for the admin dashboard (passwords are never sent)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};