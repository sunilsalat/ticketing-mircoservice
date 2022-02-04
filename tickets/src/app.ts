import mongoose from "mongoose";
import { app } from "./index";
import { natsWrapper } from "./nats-wrapper";
import { OrderCancelledListener } from "./events/listener/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listener/order-created-listener";

//connecting to db...
const start = async () => {
  try {
    // Connectin to Nats-stremaing
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    // listeners
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    // connectin to db
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("connected to db ...");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("listening on server 3000!..., auth service");
  });
};

start();
