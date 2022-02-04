import { Request, Response } from "express";
import { BadRequestError } from "@newsssticketing/common";
import JWT from "jsonwebtoken";
import { User } from "../models/user";

const SignUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if user already exsits
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("Email in use");
  }

  const user = User.build({ name, email, password });

  await user.save();

  const jwt_token = JWT.sign(
    { id: user._id, email: user.email },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: jwt_token,
  };

  res.status(201).json({ user });
};

export { SignUp };
