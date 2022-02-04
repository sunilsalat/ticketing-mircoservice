import express from "express";
import { body } from "express-validator";
import { ValidateRequest } from "@newsssticketing/common";

const router = express.Router();

import { RequireAuthMiddleware } from "@newsssticketing/common";

import { createTicket } from "../controller/create-ticket";
import { allTickets } from "../controller/get-tickets";
import { ticket } from "../controller/ticket";
import { updateTicket } from "../controller/update-ticket";

router
  .route("/t")
  .post(
    RequireAuthMiddleware,
    [
      body("title").not().isEmpty().withMessage("Title is required"),
      body("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be grater than 0"),
    ],
    ValidateRequest,
    createTicket
  );

// AllTicket
// Get-method
router.route("/").get(allTickets);

// singleTIcket
// Get-method
router.route("/:id").get(ticket);

// updateTicket
// Post-method
router
  .route("/:id/update")
  .post(
    RequireAuthMiddleware,
    [
      body("title").not().isEmpty().withMessage("Title can not be blank"),
      body("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be grater than 0"),
    ],
    ValidateRequest,
    updateTicket
  );

export { router as ticketRouter };
