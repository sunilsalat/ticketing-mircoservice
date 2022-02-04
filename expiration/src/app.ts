import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

//connecting to db...
const start = async () => {
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (error) {
    console.error(error);
  }
};

start();
