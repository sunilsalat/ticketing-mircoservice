import mongoose from "mongoose";
import { app } from "./index";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListner } from "./events/listeners/order-cancelled-listener";

//connecting to db...
const start = async () => {
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListner(natsWrapper.client).listen();

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
