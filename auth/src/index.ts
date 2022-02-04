import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFound } from "@newsssticketing/common";

const app = express();
app.set("trust porxy", true);
app.use(express.json());
app.use(
  cookieSession({
    secure: false,
    signed: false,
  })
);

import { AuthRouter } from "./routes/authRouter";
import { errorHandler } from "@newsssticketing/common";
app.use("/api/user", AuthRouter);

app.use(NotFound);

app.use(errorHandler);

export { app };
