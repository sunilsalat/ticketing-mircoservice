import nats from "node-nats-streaming";
import { TicketCreatedPublihser } from "./events/ticket-created-publisher";

console.clear();
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

// listner listening for event to be emitted
stan.on("connect", async () => {
  console.log("publisher connected to Nats");

  const publisher = new TicketCreatedPublihser(stan);
  try {
    await publisher.publish({
      id: "jksdf50",
      title: "new title",
      price: 45,
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 132,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });
});
