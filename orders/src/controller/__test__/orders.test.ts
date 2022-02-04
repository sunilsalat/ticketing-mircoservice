import request from "supertest";

import { app } from "../../index";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

const buildTickets = async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  return ticket;
};

it("fectches all order of particular user ", async () => {
  // Create three tickets
  const t2 = await buildTickets();
  const t3 = await buildTickets();
  const t1 = await buildTickets();

  const userOne = global.signin();
  const userTwo = global.signin();

  // Create one Order as user #1
  await request(app)
    .post("/api/order/create")
    .set("Cookie", userOne)
    .send({
      ticketId: t1.id,
    })
    .expect(201);

  // Create two orddres as user #2
  const { body: orderOne } = await request(app)
    .post("/api/order/create")
    .set("Cookie", userTwo)
    .send({
      ticketId: t2.id,
    })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/order/create")
    .set("Cookie", userTwo)
    .send({
      ticketId: t3.id,
    })
    .expect(201);

  // Make request to get order for user #2
  const res = await request(app)
    .get("/api/order/all")
    .set("Cookie", userTwo)
    .send({})
    .expect(200);

  // Make sure we only got the orders for  user 2

  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(orderOne.id);
  expect(res.body[1].id).toEqual(orderTwo.id);
});
