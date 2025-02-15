const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require('../middleware/authMiddleware');
const cart = require('../models/Cart');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    await cart.create({ userId: newUser._id, products: [] });
    res.status(201).json({ message: "Users and Cart created successfully, now route to login" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {

  const token = req.cookies.token || req.header("Authorization");

  if (token) {
    const verified = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(verified.id).select("-password");
    console.log("User is already logged in, route to home")
    console.log(user._id+"  "+ user.name);
    return res.status(200).json({ message: "already logged in, route to home" });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Cannot find this email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    //console.log("THis is not executed after wrong password");

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    
    res.cookie("token", token, {
        httpOnly: true, // Prevents access via JavaScript (security)
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "Strict", // Prevents CSRF attacks
        maxAge: 3600000, // 1 hour expiration
      });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    console.log("User is logged in, now route to home page");
    console.log("Welcome: "+req.user.name);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  });

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully, now route to login" });
    console.log("Logged out Successfully, now route to login");
})

module.exports = router;
