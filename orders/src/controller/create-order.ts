import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
} from "@newsssticketing/common";

const EXPIRATION_WINDOW_SECONDS = 2 * 60;

const createOrder = async (req: Request, res: Response) => {
  const { ticketId } = req.body;

  // find the ticket in database if not find means ticket purchased or does not exists in database
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError("Ticket with id not found");
  }

  // make sure ticket is not already reserved
  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError("Ticket is already reserved");
  }

  // calculate expiration date
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  // build an order and save it to the database
  const order = await Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });

  await order.save();

  // publish an event , order created
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    version: order.version,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  });

  res.status(201).send(order);
};

export { createOrder };
