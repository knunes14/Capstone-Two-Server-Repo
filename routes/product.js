const router = require("express").Router();
const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct); // Status 201 for created resource
    } catch (err) {
        console.error("Error saving product:", err); // Log the error to the console
        res.status(500).json({
            message: "Failed to create product",
            error: err.message, // Provide a more specific error message
            errors: err.errors ? Object.fromEntries(
                Object.entries(err.errors).map(([key, { message }]) => [key, message])
            ) : null // Optional: Map Mongoose validation errors to a simpler object if they exist
        });
    }
});

//UPDATE 
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted.");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if(qNew) {
            products = await Product.find().sort({createdAt: -1}).limit(1)
        } else if(qCategory) {
            products = await Product.find({categories: {
                $in: [qCategory],
            },
        });
        }else {
            products = await Product.find();
        }

        console.log("Fetched products:", products);
        res.status(200).json(products);
    } catch (err) {
        // res.status(500).json(err);
        console.error("Error fetching products:", err);  // Log the error to the server console.
        res.status(500).json({ error: err.message });
        
        
    }
});

module.exports = router;