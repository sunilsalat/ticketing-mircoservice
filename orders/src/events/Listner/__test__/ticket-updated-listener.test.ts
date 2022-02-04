import { TicketUpdatedEvent } from "@newsssticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { isExportDeclaration } from "typescript";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TikcetCreatedListener } from "../ticket-created-listener";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  // create instance
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create ticket to update
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ticket",
    price: 20,
  });

  await ticket.save();

  // create fake data of tickte updated
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "new-ticket",
    price: 999,
    version: ticket.version + 1,
    userId: "sfsdf",
  };

  // crate fake msg fucntion
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return
  return { ticket, data, msg, listener };
};

it("find update and save ticket", async () => {
  const { data, msg, listener, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("check for ack", async () => {
  const { data, listener, msg } = await setup();

  // call onMessage
  await listener.onMessage(data, msg);

  // check msg.ack call
  expect(msg.ack).toHaveBeenCalled();
});
