import { Request, Response } from "express";
import { Order } from "../models/order";

const Orders = async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    "ticket"
  );

  res.status(200).send(orders);
};

export { Orders };
