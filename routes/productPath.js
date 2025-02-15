const express = require('express');
const app = express();
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const productController = require('../controllers/productController');

app.use(express.json()); //allows to get json data from req body
router.get('/allProducts', authMiddleware ,productController.getAllProducts); //if user is not logged in, authMiddleware will not proceed
router.post('/createProduct', authMiddleware ,productController.createNewProduct);
router.patch('/updateProduct/:pid', authMiddleware ,productController.updateProduct);

module.exports = router;