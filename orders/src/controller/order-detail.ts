import { NotFoundError } from "@newsssticketing/common";
import { Request, Response } from "express";
import { Order } from "../models/order";

const orderDetail = async (req: Request, res: Response) => {
  const order = await Order.findOne({
    userId: req.currentUser!.id,
    orderId: req.params.orderId,
  }).populate("ticket");

  if(!order){
    throw new NotFoundError('Order not found!!')
  }

  res.status(200).send(order);
};

export { orderDetail };
