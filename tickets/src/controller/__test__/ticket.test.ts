import request from "supertest";
import { app } from "../../index";
import mongoose from "mongoose";

it("returns 200 and ticket, if any present ", async () => {
  const res1 = await request(app)
    .post("/api/ticket/t")
    .set("Cookie", global.signin())
    .send({
      title: "salk",
      price: 20,
    })
    .expect(201);

  const id = res1.body.id;

  const res = await request(app).get(`/api/ticket/${id}`).send({}).expect(200);

  expect(res.body.id).toEqual(id);
});

it("return 400, if ticket with id not found ", async () => {
  const id = "sdfsdf";

  await request(app).get(`/api/ticket/${id}`).send({}).expect(400);
});
