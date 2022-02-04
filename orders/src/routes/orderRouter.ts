import express from "express";
import mongoose from "mongoose";
import {
  RequireAuthMiddleware,
  ValidateRequest,
} from "@newsssticketing/common";
import { body } from "express-validator";

const router = express.Router();

import { Orders } from "../controller/orders";
import { orderDetail } from "../controller/order-detail";
import { orderDelete } from "../controller/delete-order";
import { createOrder } from "../controller/create-order";

router.route("/all").get(RequireAuthMiddleware, Orders);

router.route("/:orderId").get(RequireAuthMiddleware, orderDetail);

router
  .route("/create")
  .post(
    RequireAuthMiddleware,
    [body("ticketId").not().isEmpty().withMessage("Ticket can not be empty")],
    ValidateRequest,
    createOrder
  );

router.route("/:orderId").delete(RequireAuthMiddleware, orderDelete);

export { router as orderRouter };
