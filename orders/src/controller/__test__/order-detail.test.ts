import request from "supertest";
import { app } from "../../index";
import { Ticket } from "../../models/ticket";
import mongoose from 'mongoose'

it("returns a order if user authorized and orderId provided is valid orderId", async () => {
  // Create a ticket
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "asfd",
    price: 50,
  });
  await ticket.save();
  const user = global.signin();
  const userN = global.signin();

  // make a reuest to build an order with ticket
  const { body: order } = await request(app)
    .post("/api/order/create")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fettch the order
  const { body: fetchOrder } = await request(app)
    .get(`/api/order/${order.id}`)
    .set("Cookie", user)
    .send({})
    .expect(200);

  // return error if user try to fetch the order of other user
  await request(app)
    .get(`/api/order/${order.id}`)
    .set("Cookie", userN)
    .send({})
    .expect(404);

  expect(order.id).toEqual(fetchOrder.id);
});
