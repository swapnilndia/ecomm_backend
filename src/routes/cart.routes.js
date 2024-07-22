import express from "express";
import { buyer_token_validation } from "../middlewares/validation.middleware.js";
import {
  add_button_controller,
  clearCart_controller,
  getCart_controller,
  removeItemFromCart_controller,
  subtract_button_controller,
} from "../controllers/cart.controller.js";
const router = express.Router();

// Routes
router.post("/add", buyer_token_validation, add_button_controller); // Add a product to cart
router.put("/subtract", buyer_token_validation, subtract_button_controller); // Update cart item quantity

router.get("/", buyer_token_validation, getCart_controller); // Get cart items
router.delete(
  "/remove/:productId",
  buyer_token_validation,
  removeItemFromCart_controller
); // Remove a product from cart
router.delete("/reset", buyer_token_validation, clearCart_controller);
export default router;
