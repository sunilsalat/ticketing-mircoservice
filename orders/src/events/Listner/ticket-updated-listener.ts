import {
  Listner,
  NotFoundError,
  Subject,
  TicketUpdatedEvent,
} from "@newsssticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listner<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!ticket) {
      throw new NotFoundError("Ticket not found!");
    }

    ticket.price = data.price;
    ticket.title = data.title;

    await ticket.save();

    msg.ack();
  }
}
