import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { User } from "./models/user.model.js";
import { Product } from "./models/product.model.js";
import { Cart } from "./models/cart.model.js";
import { Order } from "./models/orders.model.js";
import UserRouter from "./routes/user.routes.js";
import ProductRouter from "./routes/product.routes.js";
import CartRouter from "./routes/cart.routes.js";
import OrderRouter from "./routes/order.routes.js";
import ApiError from "./utils/ApiError.js";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .json(new ApiError(400, "Bad Request - Invalid JSON", req.body));
  }
  next();
});

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/cart", CartRouter);
app.use("/api/v1/order", OrderRouter);

export { app };
