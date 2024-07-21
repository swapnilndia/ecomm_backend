import express from "express";
const router = express.Router();

router.post("/", placeOrder); // Place an order
router.get("/", getOrders); // Get order history
router.get("/:orderId", getOrderById); // Get a specific order

export default router;
