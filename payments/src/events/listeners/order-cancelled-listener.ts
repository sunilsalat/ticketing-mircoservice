import {
  Listner,
  OrderCancelledEvent,
  OrderStatus,
  Subject,
} from "@newsssticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListner extends Listner<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      versino: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order!.status = OrderStatus.Cancelled;

    await order.save();

    msg.ack();
  }
}
