const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");


const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, products: [] });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity || 1;
    } else {
      cart.products.push({ productId, quantity: quantity || 1 });
    }

    await cart.save();
    res.status(202).json({ message: "Product added to cart", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const removeFromCart = async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      let cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      cart.products = cart.products.filter(p => p.productId.toString() !== productId);
  
      await cart.save();
      res.status(200).json({ message: "Product removed", cart });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  const updateCartQuantity = async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
        
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }

      let cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
  
      if (productIndex > -1) {
        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({ message: "Quantity updated", cart });
      } else {
        res.status(404).json({ message: "Product not in cart" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  const getCart = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const cart = await Cart.findOne({ userId }).populate("products.productId");
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  const clearCart = async (req, res) => {
    try {
      const { userId } = req.body;
  
      let cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      cart.products = [];
      await cart.save();
  
      res.status(200).json({ message: "Cart cleared", cart });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

const checkoutCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await Order.create({
      userId,
      products: cart.products,
      totalPrice: cart.products.reduce((sum, p) => sum + p.productId.price * p.quantity, 0),
      status: "Pending"
    });

    cart.products = [];
    await cart.save();

    res.status(201).json({ message: "Order placed!", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.updateCartQuantity = updateCartQuantity;
exports.getCart = getCart;
exports.clearCart = clearCart;
exports.checkoutCart = checkoutCart;