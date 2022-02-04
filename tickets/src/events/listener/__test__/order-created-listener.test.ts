import { OrderCreatedEvent, OrderStatus } from "@newsssticketing/common";
import mongoose, { NativeError } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  // create a instance of the listner
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = await Ticket.build({
    title: "content",
    price: 50,
    userId: "sdf66",
  });

  await ticket.save();

  // crate a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "sfds55",
    expiresAt: "sdfsdf",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // fake msg
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return everything
  return { listener, ticket, data, msg };
};

it("is ticket reserved by any order pass if any  , ", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
  expect(updatedTicket!.version).toEqual(data.version + 1);
});

it("chekc ack call", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("check for the TicketUpdatedPublisher emit an event ticket updated", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // data can be accessible as jest mocks provide data
  const eventPublishedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  console.log(eventPublishedData);
  expect(data.id).toEqual(eventPublishedData.orderId);
});
