import {
  Publisher,
  Subject,
  OrderCancelledEvent,
} from "@newsssticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
}
