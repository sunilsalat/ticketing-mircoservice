import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../index";

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  mongoose.connection.close();
});

global.signin = async () => {
  const name = "doe";
  const email = "doe@gmail.com";
  const password = "secret";

  const response = await request(app)
    .post("/api/user/signup")
    .send({ name, email, password })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
