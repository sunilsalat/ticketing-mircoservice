import request from "supertest";
import { app } from "../../index";

it("returns users detail on successful request ", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/user/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  console.log(response.body.currentUser);

  expect(response.body.currentUser.email).toEqual("doe@gmail.com");
});

it("response with currentUser - null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/user/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
