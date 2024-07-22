import express from "express";
import { buyer_token_validation } from "../middlewares/validation.middleware.js";
import {
  getOrderById_controller,
  getOrders_controller,
  placeOrder_controller,
} from "../controllers/order.controller.js";
const router = express.Router();

router.post("/", buyer_token_validation, placeOrder_controller); // Place an order
router.get("/", buyer_token_validation, getOrders_controller); // Get order history
router.get("/:orderId", buyer_token_validation, getOrderById_controller); // Get a specific order

export default router;
