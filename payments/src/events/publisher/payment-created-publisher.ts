import {
  PaymentCreatedEvent,
  Publisher,
  Subject,
} from "@newsssticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subject.PaymentCreated = Subject.PaymentCreated;
}
