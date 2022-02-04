import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import JWT from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

jest.mock("../nats-wrapper.ts");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  //  clear all mocks function
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
   mongoose.connection.close();
});

// fucntion to pass cookie to request
global.signin = () => {
  // create payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "doe@gmail.com",
  };

  // create jwt-token
  const token = JWT.sign(payload, process.env.JWT_KEY!);

  // create session object
  const session = { jwt: token };

  // stringify session object
  const sessionObj = JSON.stringify(session);

  // encode to base-64
  const base64 = Buffer.from(sessionObj).toString("base64");

  return [`session=${base64}`];
};
