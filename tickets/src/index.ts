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

import { ticketRouter } from "./routes/ticketRouter";
import { errorHandler, CurrentUserMiddleware } from "@newsssticketing/common";

app.use(CurrentUserMiddleware);
app.use("/api/ticket", ticketRouter);
app.use(NotFound);

app.use(errorHandler);

export { app };
