import {
  Subject,
  TicketUpdatedEvent,
  Publisher,
} from "@newsssticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
}
