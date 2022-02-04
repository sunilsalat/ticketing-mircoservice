import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { BadRequestError } from "@newsssticketing/common";

const ticket = async (req: Request, res: Response) => {
  try {
    const singleTicket = await Ticket.findOne({ _id: req.params.id });

    res.status(200).send(singleTicket);
  } catch (error) {
    throw new BadRequestError("Ticket not found");
  }
};

export { ticket };
