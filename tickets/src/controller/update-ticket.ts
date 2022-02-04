import { request, Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { BadRequestError, NotAuthorizeError } from "@newsssticketing/common";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const updateTicket = async (req: Request, res: Response) => {
  const updateTicket = await Ticket.findOne({ _id: req.params.id });

  if (!updateTicket) {
    throw new BadRequestError("Can not update");
  }

  if (updateTicket.orderId) {
    throw new BadRequestError(
      "Can not change ticket price, While ticket is reserved"
    );
  }

  if (updateTicket.userId !== req.currentUser!.id) {
    console.log("failed because of controller");
    throw new NotAuthorizeError();
  }

  updateTicket.title = req.body.title;
  updateTicket.price = req.body.price;

  await updateTicket.save();

  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: updateTicket.id,
    title: updateTicket.title,
    price: updateTicket.price,
    userId: updateTicket.userId,
    version: updateTicket.version,
  });

  res.status(200).send(updateTicket);
};

export { updateTicket };
