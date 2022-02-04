import { Message } from "node-nats-streaming";
import { Listner } from "./base-listner";
import { Subject } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-events";

export class TicketCreatedListner extends Listner<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName = "Payment-services";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log(`Data - ${data}`);

    msg.ack();
  }
}
