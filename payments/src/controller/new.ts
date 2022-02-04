import { Request, Response } from "express";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../events/publisher/payment-created-publisher";
import {
  BadRequestError,
  NotAuthorizeError,
  NotFoundError,
  OrderStatus,
} from "@newsssticketing/common";
import { natsWrapper } from "../nats-wrapper";

const cratePayment = async (req: Request, res: Response) => {
  const { token, orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError("");
  }

  // only, User who placed order can make payment
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizeError();
  }

  // Avoiding payament of a already expired order
  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError("Can not pay for cancelled order");
  }

  //
  const charge = await stripe.charges.create({
    currency: "INR",
    amount: order.price * 100,
    source: token, // where does mony came from or use (tok_visa) for testing
  });

  const payment = Payment.build({
    orderId,
    stripeId: charge.id,
  });

  await payment.save();

  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId,
  });

  res.status(201).send({ id: payment.id });
};

export { cratePayment };
