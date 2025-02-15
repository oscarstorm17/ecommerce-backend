const Product = require('../models/Product');
const User = require('../models/User');




const createNewProduct= async (req, res) => {
    const {productName, productPrice, productImage, productDescription} = req.body;
    const newProduct = new Product({productName, productPrice, productImage, productDescription, createdByUser : String(req.user._id)});
    try{
        await newProduct.save();
        res.status(201);
        res.send("product created");
    }
    catch(err){
        console.log(err);
        res.status(500);
        res.send("Internal Server Error");
    }
} ;

const getAllProducts = async (req, res, next) => {
    let products;
    try{
        products = await Product.find();
    }
    catch(err){
        console.log(err);
        res.status(500);
        res.send("Internal Server Error");
    }
    if(products.length ===0){
        res.status(404);
        res.send("no products found");
    }
    else{
        res.status(200);
        //console.log("Welcome: "+req.user.name); // I can get username directly from req.user as it keeps on forwarding in each req, res.
        res.send({products});

    }
};

const updateProduct = async (req, res) => { //this will need price as input
    const productId = req.params.pid;       //a product is only modified by a user that has created it
    const productPrice = req.body.productPrice;
    const userid = String(req.user._id);  //userid of logged in user
    console.log(userid);
    
    let product;
    try{
        product = await Product.findById(productId);
    }
    catch(err){
        console.log(err);
        res.status(500);
        res.send("Internal Server Error");
    }
    if(product.createdByUser !== userid){   //comparing with id of user who created the product     
        console.log(product.createdByUser + "  not matched with  " + userid);
        res.status(401);
        res.send("You are not allowed to modify the product, because you are not the creator");
    }
    else{
        product.productPrice = productPrice;
        try{
            await product.save();
            res.status(200);
            res.send("updated Successfully");
        }
        catch(err){
            console.log(err);
            res.status(500);
            res.send("Internal Seveer error");
        }
    }
    
};








exports.updateProduct = updateProduct;
exports.createNewProduct = createNewProduct;
exports.getAllProducts = getAllProducts;