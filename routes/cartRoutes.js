const express = require('express');
const app = express();
const router = express.Router();
const cartMiddleware = require('../middleware/cart_user_middleware');
const cartController = require('../controllers/cartController');
const { route } = require('./productPath');

app.use(express.json());
router.post("/add", cartController.addToCart);
router.delete("/remove", cartController.removeFromCart);
router.patch("/update", cartController.updateCartQuantity);
router.get("/:userId", cartController.getCart);
router.delete("/clear", cartController.clearCart);
router.post("/checkout", cartController.checkoutCart);


module.exports = router;