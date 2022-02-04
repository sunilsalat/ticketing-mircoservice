import request from "supertest";
import { app } from "../../index";

it("it return cookie when on logout", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      name: "doe",
      email: "doe@gmail.com",
      password: "secret",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/user/logout")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
