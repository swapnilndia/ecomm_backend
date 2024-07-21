import express from "express";
import {
  product_validation,
  seller_token_validation,
} from "../middlewares/validation.middleware.js";
import {
  create_product_controller,
  delete_product_controller,
  getAll_product_controller,
  specific_product_controller,
  update_product_controller,
} from "../controllers/product.controller.js";
const router = express.Router();

// Routes for Sellers
router.post(
  "/",
  product_validation,
  seller_token_validation,
  create_product_controller
); // Add a new product (seller only)
router.get("/seller", seller_token_validation, getAll_product_controller); // Get all products for a specific seller
router.get(
  "/seller/:productId",
  seller_token_validation,
  specific_product_controller
); // Get a specific product for a seller
router.put(
  "/:productId",
  product_validation,
  seller_token_validation,
  update_product_controller
); // Update a specific product (seller only)
router.delete(
  "/:productId",
  seller_token_validation,
  delete_product_controller
); // Delete a specific product (seller only)

// Routes for Buyers
router.get("/"); // Get all products
router.get("/:productId"); // Get a specific product

export default router;
