const Product = require('../models/product.model'); // Ensure the model is correct

// Controller function to add a product
exports.addProduct = async (req, res) => {
    try {
        const { title, description, image, category, starting_price, reserve_price, seller } = req.body;

        // Validate required fields
        if (!title || !description || !image || !category || !starting_price || !seller) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Additional validation for specific fields
        if (isNaN(starting_price) || starting_price <= 0) {
            return res.status(400).json({ message: "Starting price must be a positive number." });
        }

        if (reserve_price && (isNaN(reserve_price) || reserve_price <= 0)) {
            return res.status(400).json({ message: "Reserve price must be a positive number if provided." });
        }

        // Create a new product instance
        const product = new Product({
            title,
            description,
            image,
            category,
            starting_price,
            reserve_price: reserve_price || null, // Optional field
            seller,
        });

        // Save the product to the database
        const savedProduct = await product.save();

        // Respond with success
        res.status(201).json({
            message: "Product added successfully",
            product: savedProduct, // Return the saved product
        });
    } catch (error) {
        console.error("Error adding product:", error.message);
        res.status(500).json({ message: "Failed to add product", error: error.message });
    }
};

// Controller function to fetch all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        res.status(200).json(products); // Return the list of products
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
};
