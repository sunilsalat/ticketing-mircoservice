import { Listner, TicketCreatedEvent, Subject } from "@newsssticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TikcetCreatedListener extends Listner<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;

  // this avoid duplication of data and make sure only one listner receive and process event once
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();
    msg.ack();
  }
}
