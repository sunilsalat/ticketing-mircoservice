import { Ticket } from "../models/ticket";
import { Request, Response } from "express";

const allTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ orderId: undefined });
  res.status(200).send(tickets);
};

export { allTickets };
