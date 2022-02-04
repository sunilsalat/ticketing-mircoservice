import {
  BadRequestError,
  Listner,
  OrderStatus,
  PaymentCreatedEvent,
  Subject,
} from "@newsssticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listner<PaymentCreatedEvent> {
  subject: Subject.PaymentCreated = Subject.PaymentCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    // mark order as complete once payment is completed

    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new BadRequestError("");
    }

    order.status = OrderStatus.Complete;

    await order.save();


    // emit an order update event as of version control (OCC) but not going to update order as now as it completed so not emitting

    msg.ack();
  }
}
