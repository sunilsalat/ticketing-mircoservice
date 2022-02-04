import { Listner, OrderCancelledEvent, Subject } from "@newsssticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledListener extends Listner<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    console.log(
      "#########___________ORDER_TICKET_CANCELLED____________########"
    );

    if (!ticket) {
      throw new Error("Ticket not found  !!!");
    }

    ticket!.orderId = undefined;

    await ticket.save();

    // emit an event TicketUpdatePublisher
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      orderId: ticket.orderId,
      userId: ticket.userId,
    });

    msg.ack();
  }
}
