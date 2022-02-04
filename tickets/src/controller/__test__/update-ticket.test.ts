import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../index";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("it not authrozied throw 401, and prevent ticket updation ", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post(`/api/ticket/${id}/update`)
    .send({
      title: "sldjfk",
      price: 20,
    })
    .expect(401);
});

it("returns 400 if not provided proper field", async () => {
  const cookie = global.signin();

  const res1 = await request(app)
    .post("/api/ticket/t")
    .set("Cookie", cookie)
    .send({
      title: "salk",
      price: 20,
    })
    .expect(201);

  const id = res1.body.id;

  await request(app)
    .post(`/api/ticket/${id}/update`)
    .set("Cookie", cookie)
    .expect(400);
});

it("reutns 401 , user who created can update only", async () => {
  const res1 = await request(app)
    .post("/api/ticket/t")
    .set("Cookie", global.signin())
    .send({
      title: "salk",
      price: 20,
    })
    .expect(201);

  const id = res1.body.id;

  await request(app)
    .post(`/api/ticket/${id}/update`)
    .set("Cookie", global.signin())
    .send({
      title: "sasdflk",
      price: 23,
    })
    .expect(401);
});

it("return 200 and update ticket if everything good ", async () => {
  const cookie = global.signin();

  const res1 = await request(app)
    .post("/api/ticket/t")
    .set("Cookie", cookie)
    .send({
      title: "salk",
      price: 20,
    })
    .expect(201);

  const id = res1.body.id;

  await request(app)
    .post(`/api/ticket/${id}/update`)
    .set("Cookie", cookie)
    .send({
      title: "new ticket",
      price: 50,
    })
    .expect(200);

  const res = await request(app).get(`/api/ticket/${id}`).send({}).expect(200);

  expect(res.body.title).toEqual("new ticket");
  expect(res.body.price).toEqual(50);
});

it("publish event", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post(`/api/ticket/t`)
    .set("Cookie", cookie)
    .send({
      title: "sdf",
      price: 56,
    })
    .expect(201);

  const id = res.body.id;

  await request(app)
    .post(`/api/ticket/${id}/update`)
    .set("Cookie", cookie)
    .send({
      title: "sdf",
      price: 561,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("retuns 400, if attempted to update reserved ticket", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post(`/api/ticket/t`)
    .set("Cookie", cookie)
    .send({
      title: "sdf",
      price: 5656,
    })
    .expect(201);

  const ticket = await Ticket.findById(res.body.id);
  ticket!.orderId = new mongoose.Types.ObjectId().toHexString();
  await ticket!.save();

  await request(app)
    .post(`/api/ticket/${res.body.id}/update`)
    .set("Cookie", cookie)
    .send({
      title: "ssdf",
      price: 4,
    })
    .expect(400);
});
