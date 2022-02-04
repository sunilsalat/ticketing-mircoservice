import { Request, Response } from "express";

const CurrentUserInfo = (req: Request, res: Response) => {
  // sending user null if not present in cookie 
  res.send({ currentUser: req.currentUser || null });
};

export { CurrentUserInfo };
