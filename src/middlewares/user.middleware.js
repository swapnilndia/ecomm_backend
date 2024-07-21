import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashPasswordFunction,
  verifyPasswordFunction,
} from "../utils/helperFunctions.js";

export const register_Middleware = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    const emailExists = await User.findOne({
      email: normalizedEmail,
    });
    const usernameExists = await User.findOne({
      username: normalizedUsername,
    });
    if (emailExists || usernameExists) {
      return res
        .status(409)
        .json(
          new ApiError(
            409,
            `User with Email: ${email} or Username: ${username} already exist`
          )
        );
    }
    const hashedPassword = await hashPasswordFunction(password);
    req.body.hashedPassword = hashedPassword;
    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(500, `Something went wrong`, error.message, error.stack)
      );
  }
};
export const login_Middleware = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const checkUserExists = await User.findOne({ username: username });

    if (!checkUserExists) {
      return res
        .status(404)
        .json(
          new ApiError(404, `User with Email: ${email} was not found`).toJSON()
        );
    }
    const matchPassword = await verifyPasswordFunction(
      password,
      checkUserExists.password
    );
    if (!matchPassword) {
      return res
        .status(401)
        .json(new ApiError(401, `Email or Password does not match`).toJSON());
    }
    const accessToken = generateAccessToken({
      email: checkUserExists.email,
      userId: checkUserExists._id,
      isSeller: checkUserExists.isSeller,
    });
    const refreshToken = generateRefreshToken({
      email: checkUserExists.email,
      userId: checkUserExists._id,
      isSeller: checkUserExists.isSeller,
    });
    console.log(refreshToken);
    console.log(accessToken);
    req.body.accessToken = accessToken;
    req.body.refreshToken = refreshToken;
    req.body.userId = checkUserExists._id;
    next();
  } catch (error) {
    return res.status(500).json(
      new ApiError(500, `Something went wrong`, {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
    );
  }
};
