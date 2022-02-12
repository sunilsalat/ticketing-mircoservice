import express from "express";
import { cratePayment } from "../controller/new";
import {
  RequireAuthMiddleware,
  ValidateRequest,
} from "@newsssticketing/common";
import { body } from "express-validator";

const router = express.Router();

router
  .route("/")
  .post(
    RequireAuthMiddleware,
    [
      body("token").notEmpty().withMessage("Token is required"),
      body("orderId").notEmpty().withMessage("OrderId is required"),
    ],
    ValidateRequest,
    cratePayment
  );

export { router as paymentRouter };
