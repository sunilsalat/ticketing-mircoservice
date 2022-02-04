import nats from "node-nats-streaming";
import crypto from "crypto";
import { TicketCreatedListner } from "./events/ticket-created-listner";

console.clear();
//                                            <unique_client_id>
const stan = nats.connect("ticketing", crypto.randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listner connected to nats");

  stan.on("close", () => {
    console.log("closing");
    process.exit();
  });

  new TicketCreatedListner(stan).listen();

  //   const options = stan.subscriptionOptions().setManualAckMode(true);

  // // 1<Channel_name>    2<Queue_group_name     3oprions>
  // const subscription = stan.subscribe(
  //   "ticket:created",
  //   "listnerQueueGroup",
  //   options
  // );

  // subscription.on("message", (msg: Message) => {
  //   console.log(msg.getSequence(), msg.getData(), msg.getSubject());

  //   msg.ack();
  // });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

//   queue group avoid duplication event handleling and make sure event only process once to avoid any data duplicaiton
//   prevent event to run twice
