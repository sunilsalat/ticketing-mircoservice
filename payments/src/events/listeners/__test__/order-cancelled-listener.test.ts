import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListner } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@newsssticketing/common";
import { Order } from "../../../models/order";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListner(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "asdfas",
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "sfasdf",
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, data };
};

it("checks order cancelled", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it("ack the msg", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
