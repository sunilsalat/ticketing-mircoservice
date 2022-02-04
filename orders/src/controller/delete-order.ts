import { NotFoundError } from "@newsssticketing/common";
import { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";

const orderDelete = async (req: Request, res: Response) => {
  const order = await Order.findOne({
    userId: req.currentUser!.id,
    orderId: req.params.orderId,
  }).populate("ticket");

  if (!order) {
    throw new NotFoundError("Order not found!!");
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // publish an event with cancel
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).send({});
};

export { orderDelete };
