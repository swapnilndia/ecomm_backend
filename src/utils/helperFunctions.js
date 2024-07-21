import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const A_TOKEN = process.env.ACCESS_TOKEN_SECRET;
const R_TOKEN = process.env.REFRESH_TOKEN_SECET;
export const hashPasswordFunction = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const verifyPasswordFunction = async (password, hashedPassword) => {
  const response = await bcrypt.compare(password, hashedPassword);
  return response;
};

export const generateAccessToken = ({ email, userId, isSeller }) => {
  const accessToken = jwt.sign({ email, userId, isSeller }, A_TOKEN, {
    expiresIn: "1d",
  });
  return accessToken;
};
export const generateRefreshToken = ({ email, userId, isSeller }) => {
  const refreshToken = jwt.sign({ email, userId, isSeller }, R_TOKEN, {
    expiresIn: "7d",
  });
  return refreshToken;
};

export const isTokenExpired = (expiryTime) => {
  const currentTime = Math.ceil(new Date().getTime() / 1000);
  if (currentTime > expiryTime) {
    return true;
  } else {
    return false;
  }
};
