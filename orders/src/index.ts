import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import {
  NotFound,
  errorHandler,
  CurrentUserMiddleware,
} from "@newsssticketing/common";

const app = express();
app.set("trust porxy", true);
app.use(express.json());

app.use(
  cookieSession({
    secure: false,
    signed: false,
  })
);

import { orderRouter } from "./routes/orderRouter";

app.use(CurrentUserMiddleware);
app.use("/api/order", orderRouter);
app.use(NotFound);
app.use(errorHandler);

export { app };
