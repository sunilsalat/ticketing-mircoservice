import { Request, Response } from "express";
import { User } from "../models/user";
import { BadRequestError } from "@newsssticketing/common";
import JWT from "jsonwebtoken";

const SignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError("Login failed");
  }

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch) {
    throw new BadRequestError("Login failed");
  }

  const jwt_token = JWT.sign(
    { id: user._id, email: user.email },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: jwt_token,
  };

  res.status(200).json({ user });
};

export { SignIn };
