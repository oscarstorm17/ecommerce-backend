const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Not Logged in/ Not Authorized" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(verified.id).select("-password");
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    req.user = user; // Attach user info to request //access user id by req._id
    next(); // Move to next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token, login again" });
  }
};

module.exports = authMiddleware;
