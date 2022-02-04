import { TicketCreatedEvent } from "@newsssticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TikcetCreatedListener } from "../ticket-created-listener";

const setup = async () => {
  // create Listner instance
  const listener = new TikcetCreatedListener(natsWrapper.client);

  // create a fake data
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "ticket.title",
    price: 123,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake messgae
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with te data object + message object
  await listener.onMessage(data, msg);

  // write assertion to make sure a ticket was created\
  const ticket = await Ticket.findById(data.id);

  console.log(ticket!.id);
  console.log(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.id).toEqual(data.id);
});

it("ack the message", async () => {
  const { data, listener, msg } = await setup();

  // call onMessage
  await listener.onMessage(data, msg);

  // check msg.ack call
  expect(msg.ack).toHaveBeenCalled();
});
