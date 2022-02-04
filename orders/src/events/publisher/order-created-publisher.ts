import { Publisher, Subject, OrderCreatedEvent } from "@newsssticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
}
