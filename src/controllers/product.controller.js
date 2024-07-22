import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const create_product_controller = async (req, res) => {
  console.log(req.body);
  console.log(req.user);
  const { name, description, category, price, quantityAvailable, image } =
    req.body;
  const { userId } = req.user;
  try {
    const createProduct = await Product.create({
      name,
      description,
      category,
      price,
      quantityAvailable,
      sellerId: userId,
      image: image ? image : null,
    });
    if (!createProduct) {
      return res.status(400).json(
        new ApiError(400, "Unable to process request at this time", {
          error: "Internal server error",
        })
      );
    }
    return res
      .status(201)
      .json(
        new ApiResponse(201, createProduct, "Product successfully registered")
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError("500", "Internal Server error", error));
  }
};
export const getAllSellers_product_controller = async (req, res) => {
  const { userId } = req.user;
  try {
    const productList = await Product.find({
      sellerId: userId,
    });
    if (!productList) {
      return res.status(404).json(new ApiError(404, "No product found", {}));
    }
    return res
      .status(201)
      .json(
        new ApiResponse(200, productList, "Products successfully retrived")
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError("500", "Internal Server error", error));
  }
};

export const specific_product_controller = async (req, res) => {
  const { productId } = req.params;
  try {
    const specificProduct = await Product.findOne({
      _id: productId,
    });
    if (!specificProduct) {
      return res.status(404).json(new ApiError(404, "No product found", {}));
    }
    return res
      .status(201)
      .json(
        new ApiResponse(200, specificProduct, "Product successfully retrived")
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError("500", "Internal Server error", error));
  }
};

export const update_product_controller = async (req, res) => {
  const { productId } = req.params;
  const { name, description, category, price, quantityAvailable, image } =
    req.body;
  const { userId } = req.user;
  const filter = {
    _id: productId,
    sellerId: userId,
  };
  const updateObj = {
    name,
    description,
    category,
    price,
    quantityAvailable,
    image: image ? image : null,
  };

  try {
    const updateProduct = await Product.updateOne(filter, { $set: updateObj });
    console.log(updateProduct);
    if (updateProduct.matchedCount === 0) {
      return res.status(400).json(
        new ApiError(400, "Unable to process request at this time", {
          error: "Internal server error",
        })
      );
    }
    if (updateProduct.modifiedCount === 1) {
      return res
        .status(201)
        .json(
          new ApiResponse(200, updateProduct, "Product successfully Updated")
        );
    }
    return res
      .status(500)
      .json(new ApiError("500", "Internal Server error", error));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError("500", "Internal Server error", error));
  }
};

export const delete_product_controller = async (req, res) => {
  const { productId } = req.params;
  try {
    const deleteProduct = await Product.deleteOne({
      _id: productId,
    });
    console.log(deleteProduct);
    if (
      deleteProduct.acknowledged === true &&
      deleteProduct.deletedCount === 0
    ) {
      return res.status(404).json(new ApiError(404, "No product found", {}));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, deleteProduct, "Product successfully deleted")
      );

    // return res.status(500).json(new ApiError("500", "Internal Server error"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError("500", "Internal Server error", error));
  }
};

export const getAllBuyers_product_controller = async (req, res) => {
  try {
    const productList = await Product.find();
    if (!productList) {
      return res.status(404).json(new ApiError(404, "No product found", {}));
    }
    return res
      .status(201)
      .json(
        new ApiResponse(200, productList, "Products successfully retrived")
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError("500", "Internal Server error", error));
  }
};
