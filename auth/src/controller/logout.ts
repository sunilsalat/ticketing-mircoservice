import { Request, Response } from "express";

const LogOut = (req: Request, res: Response) => {
  req.session = null;
  res.status(200).send();
};

export { LogOut };
