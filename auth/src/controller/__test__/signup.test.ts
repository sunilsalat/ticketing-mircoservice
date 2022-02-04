import request from "supertest";

import { app } from "../../index";

it("it returns 201 on successful signup", async () => {
  return request(app)
    .post("/api/user/signup")
    .send({
      name: "doe",
      email: "doe@gmail.com",
      password: "secret",
    })
    .expect(201);
});

it("it return 400 if email provide wrong ", async () => {
  return request(app)
    .post("/api/user/signup")
    .send({
      name: "doe",
      email: "sdf",
      password: "secret",
    })
    .expect(400);
});

it("it return 400 if password provide wrong ", async () => {
  return request(app)
    .post("/api/user/signup")
    .send({
      name: "doe",
      email: "email@gmail.com",
      password: "p",
    })
    .expect(400);
});

it("it return 400 if email password or name is missing", async () => {
  await request(app).post("/api/user/signup").send({}).expect(400);
});

it("preventing email duplicaiton ", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      name: "doe",
      email: "doe@gmail.com",
      password: "secret",
    })
    .expect(201);

  await request(app)
    .post("/api/user/signup")
    .send({
      name: "doe",
      email: "doe@gmail.com",
      password: "secret",
    })
    .expect(400);
 });

it("checkig for cookie in response", async () => {
  const response = await request(app)
    .post("/api/user/signup")
    .send({
      name: "doe",
      email: "doe@gmail.com",
      password: "secret",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
