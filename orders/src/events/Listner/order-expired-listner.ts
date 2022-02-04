import {
  BadRequestError,
  Listner,
  OrderExpiredEvent,
  OrderStatus,
  Subject,
} from "@newsssticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";

export class OrderExpiredListner extends Listner<OrderExpiredEvent> {
  subject: Subject.OrderExpired = Subject.OrderExpired;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderExpiredEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    console.log(`********_ORDER EXPIRED_********`);

    if (!order) {
      throw new BadRequestError("Order not found!");
    }

    if (order.status == OrderStatus.Complete) {
      console.log(order.status);
      console.log(OrderStatus.Complete);
      return msg.ack();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
