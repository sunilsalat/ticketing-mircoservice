import { Publisher } from "./base-publisher";
import { Subject } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-events";

export class TicketCreatedPublihser extends Publisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
