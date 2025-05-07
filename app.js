const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Order Schema (Supports Multiple Products)
const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    cartProducts: [
        {
            id: String,
            name: String,
            quantity: Number,
            new_price: Number,
            image: String,
            total: Number, // Store total price of product (new_price * quantity)
        }
    ],
});

const Order = mongoose.model("Order", orderSchema);

// Register Order Route
app.post("/register", async (req, res) => {
    try {
        const { name, email, address, city, phone, whatsapp, cartProducts } = req.body;

        // Calculate total for each product
        const updatedCartProducts = cartProducts.map(product => ({
            ...product,
            total: product.new_price * product.quantity,
        }));

        const newOrder = new Order({
            name,
            email,
            address,
            city,
            phone,
            whatsapp,
            cartProducts: updatedCartProducts,
        });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
