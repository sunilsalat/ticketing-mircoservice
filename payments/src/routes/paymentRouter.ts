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
    [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
    ValidateRequest,
    cratePayment
  );

export { router as paymentRouter };
