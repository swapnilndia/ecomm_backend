import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const register_controller = async (req, res) => {
  const { username, email, isSeller, storeName, hashedPassword } = req.body;
  try {
    const createUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isSeller,
      storeName: isSeller ? storeName : null,
    });
    if (!createUser) {
      return res.status(400).json(
        new ApiError(400, "Unable to process request at this time", {
          error: "Internal server error",
        })
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createUser, "User successfully Signed Up"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError("500", "Internal Server error", error));
  }
};

export const login_controller = async (req, res) => {
  console.log(req.body);
  const { accessToken, refreshToken, userId, isSeller } = req.body;
  try {
    const updatedUser = await User.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          accessToken,
          refreshToken,
        },
      }
    );
    if (updatedUser.matchedCount === 1 && updatedUser.modifiedCount === 1) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
            userId,
            isSeller,
          },
          "User successfully Logged In"
        )
      );
    }
    return res.status(400).json(
      new ApiError(400, "Unable to process request at this time", {
        ...updatedUser,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError("500", "Internal Server error", error));
  }
};
