import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publisher/ticket-create-publisher";
import { natsWrapper } from "../nats-wrapper";

const createTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id,
  });

  await ticket.save();

  await new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  });

  res.status(201).send(ticket);
};

export { createTicket };
