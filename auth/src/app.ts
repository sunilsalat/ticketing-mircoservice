import mongoose from "mongoose";
import { app } from "./index";

//connecting to db...
const start = async () => {
  console.log("starting up...");
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("connected to db ...");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("listernig on server 3000!..., auth service");
  });
};

start();
