import {
  Subject,
  OrderCreatedEvent,
  Listner,
  OrderStatus,
} from "@newsssticketing/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedListener extends Listner<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
