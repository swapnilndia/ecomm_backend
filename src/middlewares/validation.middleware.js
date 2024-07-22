import ApiError from "../utils/ApiError.js";
import { isTokenExpired } from "../utils/helperFunctions.js";
import {
  login_schema,
  product_schema,
  register_schema,
} from "../utils/schema.js";
import jwt from "jsonwebtoken";

export const register_validation = async (req, res, next) => {
  try {
    await register_schema.validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const errors = error.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    res
      .status(400)
      .json(new ApiError(400, "One or more validation error", errors));
  }
};

export const login_validation = async (req, res, next) => {
  try {
    await login_schema.validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const errors = error.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    res
      .status(400)
      .json(new ApiError(400, "One or more validation error", errors));
  }
};

export const product_validation = async (req, res, next) => {
  try {
    await product_schema.validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const errors = error.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    res
      .status(400)
      .json(new ApiError(400, "One or more validation error", errors));
  }
};

export const seller_token_validation = async (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  const access_token = tokenHeader && tokenHeader.split(" ")[1];
  if (!access_token) {
    return res.status(401).json(
      new ApiError(401, "Authorization token Missing", {
        access_token,
      })
    );
  }
  try {
    const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
    const decodedToken = jwt.verify(access_token, access_token_secret);
    const checkTokenExpiry = isTokenExpired(decodedToken.exp);
    if (checkTokenExpiry) {
      return res.status(403).json(
        new ApiError(403, "Unauthorized Access - Token Expired", {
          access_token,
        })
      );
    }
    if (!decodedToken.isSeller) {
      return res.status(403).json(
        new ApiError(
          403,
          "Unauthorized Access - Seller account is needed to perform this operation",
          {
            access_token,
          }
        )
      );
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(
        new ApiError(401, "Unauthorized Access - Token Expired", {
          access_token,
        })
      );
    } else if (error.name === "JsonWebTokenError") {
      return res.status(403).json(
        new ApiError(403, "Forbidden Access - Invalid Token", {
          access_token,
        })
      );
    } else {
      res.status(500).json(new ApiError(500, "Internal Server Error 1"));
    }
  }
};
export const buyer_token_validation = async (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  const access_token = tokenHeader && tokenHeader.split(" ")[1];
  if (!access_token) {
    return res.status(401).json(
      new ApiError(401, "Authorization token Missing", {
        access_token,
      })
    );
  }
  try {
    const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
    const decodedToken = jwt.verify(access_token, access_token_secret);
    const checkTokenExpiry = isTokenExpired(decodedToken.exp);
    if (checkTokenExpiry) {
      return res.status(403).json(
        new ApiError(403, "Unauthorized Access - Token Expired", {
          access_token,
        })
      );
    }
    if (decodedToken.isSeller) {
      return res.status(403).json(
        new ApiError(
          403,
          "Unauthorized Access - Buyer account is needed to perform this operation",
          {
            access_token,
          }
        )
      );
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(
        new ApiError(401, "Unauthorized Access - Token Expired", {
          access_token,
        })
      );
    } else if (error.name === "JsonWebTokenError") {
      return res.status(403).json(
        new ApiError(403, "Forbidden Access - Invalid Token", {
          access_token,
        })
      );
    } else {
      res.status(500).json(new ApiError(500, "Internal Server Error 1"));
    }
  }
};
