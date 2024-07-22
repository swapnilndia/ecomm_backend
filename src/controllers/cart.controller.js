import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getCart_controller = async (req, res) => {
  const { userId } = req.user; // Assuming req.user is an object with _id field

  console.log("User ID:", userId); // Debugging statement

  try {
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json(new ApiError(404, "Cart not found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart items retrieved successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

// Add item or increase quantity in cart
export const add_button_controller = async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.body; // No quantity needed, default to 1

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = await Cart.create({ userId, items: [{ productId, quantity: 1 }] });
    } else {
      // Find if the item is already in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Item exists, increase quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // Item does not exist, add it with quantity 1
        cart.items.push({ productId, quantity: 1 });
      }
    }

    const updatedCart = await cart.save();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedCart,
          "Item added or quantity increased successfully"
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

// Subtract item quantity in cart
export const subtract_button_controller = async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.body; // No quantity needed, just to decrement

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json(new ApiError(404, "Cart not found"));
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Item exists, decrease quantity
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        // Remove item if quantity drops to 0
        cart.items.splice(itemIndex, 1);
      }
      const updatedCart = await cart.save();
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedCart,
            "Item quantity decreased successfully"
          )
        );
    } else {
      res.status(404).json(new ApiError(404, "Product not found in cart"));
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

// Remove item from cart
export const removeItemFromCart_controller = async (req, res) => {
  const { userId } = req.user;
  const productId = req.params.productId;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json(new ApiError(404, "Cart not found"));
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      const updatedCart = await cart.save();
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedCart,
            "Product removed from cart successfully"
          )
        );
    } else {
      res.status(404).json(new ApiError(404, "Product not found in cart"));
    }
  } catch (error) {
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};
// Clear cart for a user
export const clearCart_controller = async (req, res) => {
  const { userId } = req.user;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
