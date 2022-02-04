import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../index";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returnes and 400 , if ticket not procide in body", async () => {
  await request(app)
    .post("/api/order/create")
    .set("Cookie", global.signin())
    .send({})
    .expect(400);
});

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/order/create")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if the ticket alreasy reserved", async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "sfasdfas",
    price: 20,
  });
  await ticket.save();

  const order = await Order.build({
    userId: "sdfsd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  await request(app)
    .post("/api/order/create")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserve ticket or create order", async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    title: "new ticket",
    price: 500,
  });

  await ticket.save();

  const res = await request(app)
    .post("/api/order/create")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(res.body.status).toEqual("created");

  // extra just to check is resverd fucntionality
  await request(app)
    .post("/api/order/create")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("check for publish event or not", async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    title: "new ticket",
    price: 500,
  });

  await ticket.save();

  const res = await request(app)
    .post("/api/order/create")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(res.body.status).toEqual("created");

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
