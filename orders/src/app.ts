import mongoose from "mongoose";
import { OrderExpiredListner } from "./events/Listner/order-expired-listner";
import { TikcetCreatedListener } from "./events/Listner/ticket-created-listener";
import { TicketUpdatedListener } from "./events/Listner/ticket-updated-listener";
import { PaymentCreatedListener } from "./events/Listner/payment-created-listener";
import { app } from "./index";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  try {
    // Connection to nats-streaming server
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    // Listening to events
    new TikcetCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new OrderExpiredListner(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    //  Connection to DB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to DB...");
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log("listening on server 3000!..., order service");
  });
};

start();
