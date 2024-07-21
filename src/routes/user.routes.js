import { Router } from "express";
import {
  login_Middleware,
  register_Middleware,
} from "../middlewares/user.middleware.js";
import {
  login_validation,
  register_validation,
} from "../middlewares/validation.middleware.js";
import {
  login_controller,
  register_controller,
} from "../controllers/user.controller.js";

const router = Router();

router.post(
  "/register",
  register_validation,
  register_Middleware,
  register_controller
);
router.post("/login", login_validation, login_Middleware, login_controller);

export default router;
