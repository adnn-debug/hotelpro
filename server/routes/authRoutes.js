const express = require("express");
const router = express.Router();
const { signup, login, getUsers } = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);

// Admin only: list every user
router.get("/users", verifyToken, isAdmin, getUsers);

module.exports = router;