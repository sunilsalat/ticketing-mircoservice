import { Stan, Message } from "node-nats-streaming";
import { Subject } from "./subjects";

interface Event {
  subject: Subject;
  data: any;
}

export abstract class Listner<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;

  private client: Stan;
  protected ackWait = 1000 * 5;

  constructor(client: Stan) {
    this.client = client;
  }

  // Setting subscription options
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName)
      .setAckWait(this.ackWait);
  }

  listen() {
    //   Initialize subscription
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    //   Set listner to subscription
    subscription.on("message", (msg: Message) => {
      console.log(
        `Message received: - ${this.subject} / ${this.queueGroupName}`
      );

      const parsedData = this.parseMessage(msg);

      //   onMessage provided to subclass to get data and to acknowledge(stan.ack())
      this.onMessage(parsedData, msg);
    });
  }

  //   Hepler function to return data in string format
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8")); // if incoming data if buffer
  }
}
