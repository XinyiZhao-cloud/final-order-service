const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3002;

// Temporary in-memory orders
let orders = [];

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Order Service is running" });
});

// Get all orders
app.get("/orders", (req, res) => {
    res.json(orders);
});

// Create order
app.post("/orders", (req, res) => {
    const { customerName, items } = req.body;

    const newOrder = {
        id: orders.length + 1,
        customerName,
        items,
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// Update order status
app.put("/orders/:id", (req, res) => {
    const id = Number(req.params.id);
    const order = orders.find(o => o.id === id);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status;
    res.json(order);
});

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});