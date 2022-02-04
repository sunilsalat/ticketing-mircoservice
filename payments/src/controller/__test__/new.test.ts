import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../index";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { OrderStatus } from "@newsssticketing/common";
import { stripe } from "../../stripe";

it("404, if order not found", async () => {
  await request(app)
    .post("/api/payment")
    .set("Cookie", global.signin())
    .send({
      token: "sdfsf",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("401, if purchasing order that dosent belong to user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 100,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await order.save();

  await request(app)
    .post("/api/payment")
    .set("Cookie", global.signin())
    .send({
      token: "sdfsdf",
      orderId: order.id,
    })
    .expect(401);
});

it("400, if purchasing a cancelled order or expired order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 100,
    status: OrderStatus.Cancelled,
    userId,
  });

  await order.save();

  await request(app)
    .post("/api/payment")
    .set("Cookie", global.signin(userId))
    .send({
      token: "sdfsf",
      orderId: order.id,
    })
    .expect(400);
});

it("201, if payment successful", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 10000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price,
    version: 0,
    status: OrderStatus.Created,
    userId,
  });

  await order.save();

  await request(app)
    .post("/api/payment")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });

  const charge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  );

  expect(charge).toBeDefined();

  // check for payment entry in db
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: charge!.id,
  });

  expect(payment!.orderId).toEqual(order.id);
});
