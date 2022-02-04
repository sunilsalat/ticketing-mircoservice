import request from "supertest";
import { app } from "../../index";
import { Ticket } from "../../models/ticket";
import { ticketRouter } from "../../routes/ticketRouter";

import { natsWrapper } from "../../nats-wrapper";

it("can be only access if user signed in", async () => {
  const Response = await request(app)
    .post("/api/ticket/t")
    .send({})
    .expect(401);
});

it("return response not equal to 401, if signed in ", async () => {
  const Response = await request(app)
    .post("/api/ticket/t")
    .set("Cookie", global.signin())
    .send({});

  expect(Response.status).not.toEqual(401);
});

it("return error if title is empty", async () => {
  await request(app)
    .post("/api/ticket/t")
    .set("Cookie", global.signin())
    .send({ title: "", price: -10 })
    .expect(400);
});

it("return error if price is empty or invalid", async () => {
  await request(app)
    .post("/api/ticket/t")
    .set("Cookie", global.signin())
    .send({ title: "sdfaas", price: -10 })
    .expect(400);
});

it("with valid inputs saved to databse", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/ticket/t")
    .set("Cookie", global.signin())

    .send({
      title: "sfsaf",
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it("pblishes an event", async () => {
  await request(app)
    .post("/api/ticket/t")
    .set("Cookie", global.signin())
    .send({
      title: "alskjd",
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
