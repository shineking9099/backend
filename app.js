const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Order Schema
const orderSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    city: String,
    phone: String,
    whatsapp: String,
    cartProducts: [
        {
            id: String,
            name: String,
            quantity: Number,
            new_price: Number,
            image: String,
            total: Number,
        }
    ],
});

const Order = mongoose.model("Order", orderSchema);

// Register Order Route
app.post("/register", async (req, res) => {
    try {
        const { name, email, address, city, phone, whatsapp, cartProducts } = req.body;

        const updatedCartProducts = cartProducts.map(p => ({
            ...p,
            total: p.new_price * p.quantity
        }));

        const newOrder = new Order({ name, email, address, city, phone, whatsapp, cartProducts: updatedCartProducts });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
