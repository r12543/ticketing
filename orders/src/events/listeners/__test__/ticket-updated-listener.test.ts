import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@bohemian_org/ticketing-common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
    });
    await ticket.save();

    const data: TicketUpdatedEvent["data"] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: "updated concert",
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, ticket, data, msg };
};

it("find, update, and saves a ticket", async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it("acknowledges the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
    const { listener, data, msg } = await setup();

    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    } catch (error) {}

    expect(msg.ack).not.toHaveBeenCalled();
});
