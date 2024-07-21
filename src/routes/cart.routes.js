import express from "express";
const router = express.Router();

// Routes
router.post("/add"); // Add a product to cart
router.get("/"); // Get cart items
router.put("/update"); // Update cart item quantity
router.delete("/remove/:productId"); // Remove a product from cart

export default router;
