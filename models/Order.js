const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to Product
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } // Store price at the time of purchase
    }
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);