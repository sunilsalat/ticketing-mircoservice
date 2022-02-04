import { OrderCancelledEvent } from "@newsssticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create an listner instance

  const listener = new OrderCancelledListener(natsWrapper.client);

  // create a ticket
  const ticket = Ticket.build({
    price: 45,
    title: "sdfsdf",
    userId: "new user456",
  });

  await ticket.save();

  // create fake data for listener
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // create fake msg
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return
  return { listener, msg, data, ticket };
};

it("check orderId empty ", async () => {
  const { listener, msg, data, ticket } = await setup();

  console.log(ticket);

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toEqual(data.id);
});
