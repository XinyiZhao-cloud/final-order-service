const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3002;

// In-memory orders 
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

    const normalizedItems = (items || []).map((item) => {
        const quantity = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;

        return {
            productId: item.productId || null,
            name: item.name || "Unknown Product",
            quantity,
            price,
            subtotal: quantity * price
        };
    });

    const totalAmount = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const newOrder = {
        id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
        customerName: customerName || "Guest",
        items: normalizedItems,
        status: "Pending",
        createdAt: new Date().toISOString(),
        totalAmount
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// Update order status
app.put("/orders/:id", (req, res) => {
    const id = Number(req.params.id);
    const order = orders.find((o) => o.id === id);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }

    order.status = status;
    res.json(order);
});

// Delete order (optional, nice for demo)
app.delete("/orders/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = orders.findIndex((o) => o.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Order not found" });
    }

    const deleted = orders[index];
    orders.splice(index, 1);

    res.json({ message: "Order deleted", order: deleted });
});

// Reset orders (for testing/demo purposes) 
app.post("/reset-orders", (req, res) => {
    orders = [];
    res.json({ message: "Orders reset" });
});

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});