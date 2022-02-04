import express from "express";
import { body } from "express-validator";
import {
  ValidateRequest,
  CurrentUserMiddleware,
} from "@newsssticketing/common";

const router = express.Router();

import { LogOut } from "../controller/logout";
import { SignIn } from "../controller/signIn";
import { SignUp } from "../controller/signUp";
import { CurrentUserInfo } from "../controller/currentUser";

router.route("/currentuser").get(CurrentUserMiddleware, CurrentUserInfo);

router
  .route("/signup")
  .post(
    [
      body("name").trim().isLength({ min: 2, max: 50 }),
      body("email").isEmail().withMessage("Email must be valid"),
      body("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
    ],
    ValidateRequest,
    SignUp
  );

router
  .route("/signin")
  .post(
    [
      body("email").notEmpty().isEmail().withMessage("Invlaid email"),
      body("password").trim().notEmpty().withMessage("Invalid password"),
    ],
    ValidateRequest,
    SignIn
  );

router.route("/logout").post(LogOut);

export { router as AuthRouter };
