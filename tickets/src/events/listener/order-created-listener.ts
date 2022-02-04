import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Listner, OrderCreatedEvent, Subject } from "@newsssticketing/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listner<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // reach to ticket and find a ticket a order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if not ticket throwe an Errro
    if (!ticket) {
      throw new Error("Ticket not found ");
    }

    // Mark a ticket being reserved by marking ordre id property
    ticket.orderId = data.id;

    // save a ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // ack the message
    msg.ack();
  }
}
