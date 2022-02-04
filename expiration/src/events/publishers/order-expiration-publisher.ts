import { OrderExpiredEvent, Publisher, Subject } from "@newsssticketing/common";

export class OrderExpiredPublisher extends Publisher<OrderExpiredEvent> {
  subject: Subject.OrderExpired = Subject.OrderExpired;
}
