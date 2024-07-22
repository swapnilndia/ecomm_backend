import { Cart } from "../models/cart.model.js";
import { Order } from "../models/orders.model.js";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const placeOrder_controller = async (req, res) => {
  console.log("hi there");
  const { userId } = req.user;

  try {
    // Retrieve the cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json(new ApiError(400, "Cart is empty or not found"));
    }

    // Create the order items array and calculate the total price
    const orderItems = [];
    let totalPrice = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.productId);
      if (!product) {
        throw new ApiError(404, `Product not found: ${cartItem.productId}`);
      }

      // Ensure the product has enough quantity
      if (product.quantityAvailable < cartItem.quantity) {
        throw new ApiError(400, `Not enough stock for product: ${product._id}`);
      }

      // Calculate the total price for the item
      const itemTotalPrice = product.price * cartItem.quantity;
      totalPrice += itemTotalPrice;

      // Add item to order items array
      orderItems.push({
        productId: product._id,
        quantity: cartItem.quantity,
        price: product.price,
      });

      // Update the product quantity
      product.quantityAvailable -= cartItem.quantity;
      await product.save();
    }

    // Create a new order
    const order = new Order({
      userId,
      items: orderItems,
      totalPrice,
    });

    await order.save();

    // Empty the cart
    cart.items = [];
    await cart.save();

    res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

export const getOrders_controller = async (req, res) => {
  const { userId } = req.user;

  try {
    const orders = await Order.find({ userId }).populate("items.productId");
    if (!orders.length) {
      return res.status(404).json(new ApiError(404, "No orders found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

export const getOrderById_controller = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("items.productId");
    if (!order) {
      return res.status(404).json(new ApiError(404, "Order not found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, order, "Order retrieved successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};
