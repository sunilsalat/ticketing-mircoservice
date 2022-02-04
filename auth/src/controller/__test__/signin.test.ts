
import request from "supertest";
import { app } from "../../index";

it("fails when email doesn not exist provided", async () => {
  await request(app)
    .post("/api/user/signin")
    .send({
      email: "doe@gmail.com",
      password: "secret",
    })
    .expect(400);
});

it("fails when incorrect password given", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      name: "doe",
      email: "doe@gmail.com",
      password: "secret",
    })
    .expect(201);

  await request(app)
    .post("/api/user/signin")
    .send({
      email: "doe@gmail.com",
      password: "sd",
    })
    .expect(400);
});

it("retuns cookie on successful signup", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      name: "doe",
      email: "doe@gmail.com",
      password: "secret",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/user/signin")
    .send({
      email: "doe@gmail.com",
      password: "secret",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
