require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const productPath = require('./routes/productPath');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require("./routes/cartRoutes");

app.use(express.json()); //allows to get json data from req body
app.use(cors());
app.use(cookieParser());

//connect to mongodb atlas
mongoose.connect(process.env.MONGO_URI, {}).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));
  
  // Routes
  app.use("/products",productPath);
  app.use("/api/auth", authRoutes);
  app.use("/cart", cartRoutes);

  // 404 Error Handler (Catch-All)
  app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));