import request from "supertest";
import { app } from "../../index";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("check wether order deleted or not ", async () => {
  const user = global.signin();

  // create a ticket
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "sdfsa",
    price: 566,
  });
  await ticket.save();

  // craete an order
  const { body: order } = await request(app)
    .post("/api/order/create")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/order/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const { body: fetchedOrder } = await request(app)
    .get("/api/order/${order.id}")
    .set("Cookie", user)
    .send({ orderId: order.id })
    .expect(200);

  expect(fetchedOrder.status).toEqual("cancelled");
});

it("emits an order cancel an event", async () => {
  const user = global.signin();

  // create a ticket
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    title: "sdfsa",
    price: 566,
  });
  await ticket.save();

  // craete an order
  const { body: order } = await request(app)
    .post("/api/order/create")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/order/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
