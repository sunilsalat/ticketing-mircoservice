import { ticket } from "../../controller/ticket";
import { Ticket } from "../ticket";

it("implement optimistic concurrency control", async () => {
  // create an instance of ticket
  const ticket = await Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make seprate changes to ticket
  firstInstance!.price = 10;
  secondInstance!.price = 15;

  // save changes to firs ticket fetched
  // version of doc increment at this step
  await firstInstance!.save();

  // save the second fetched ticket
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not reach this point !!!");
});

it("increments version nmbets on multople saves", async () => {
  const ticket = await Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
