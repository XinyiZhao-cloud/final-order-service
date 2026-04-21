/**
 * CST8915 Final Project - Order Service
 *
 * Author: Xinyi Zhao
 * Course: CST8915 Full-stack Cloud-native Development
 * Semester: Winter 2026
 *
 * Description:
 * This service handles customer orders for the Best Buy demo application.
 * It provides RESTful APIs to create, retrieve, update, and delete orders.
 *
 * Architecture Role:
 * - Acts as a backend microservice in a Kubernetes-based system
 * - Communicates with store-front and store-admin services via HTTP
 * - Currently uses in-memory storage for simplicity (non-persistent)
 *
 * Features:
 * - Create new orders from cart checkout
 * - Retrieve all orders for admin dashboard
 * - Update order status (Pending → Completed/Cancelled)
 * - Delete orders (optional, for demo/testing)
 * - Reset all orders (used to clean demo environment)
 *
 * Note:
 * - Orders are stored in memory and will be cleared when the pod restarts
 * - Designed for demonstration purposes in CI/CD and AKS deployment
 */
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3002;

// ==============================
// In-memory storage
// ==============================
// Orders are stored temporarily in memory.
// This means data will reset when the service restarts.
let orders = [];

// ==============================
// Health Check Endpoint
// ==============================
// Used to verify the service is running.
app.get("/", (req, res) => {
    res.json({ message: "Order Service is running" });
});

// ==============================
// Get All Orders
// ==============================
// Returns all existing orders for admin dashboard display.
app.get("/orders", (req, res) => {
    res.json(orders);
});

// ==============================
// Create New Order
// ==============================
// Accepts customer name and cart items, calculates totals,
// and creates a new order with default status "Pending".
app.post("/orders", (req, res) => {
    const { customerName, items } = req.body;

    // Normalize incoming items to ensure valid data types
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

    // Calculate total order amount
    const totalAmount = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Generate incremental order ID
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

// ==============================
// Update Order Status
// ==============================
// Allows admin to change order status to Completed or Cancelled.
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

// ==============================
// Delete Order
// ==============================
// Removes an order from the system (used for demo/testing purposes).
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

// ==============================
// Reset Orders (Demo Utility)
// ==============================
// Clears all orders to reset demo environment.
app.post("/reset-orders", (req, res) => {
    orders = [];
    res.json({ message: "Orders reset" });
});

// ==============================
// Start Server
// ==============================
app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});