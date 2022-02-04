import {
  Subject,
  TicketCreatedEvent,
  Publisher,
 
} from "@newsssticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
