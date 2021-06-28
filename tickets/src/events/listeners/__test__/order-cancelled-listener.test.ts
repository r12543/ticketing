import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import {
    OrderCancelledEvent,
    OrderStatus,
} from "@bohemian_org/ticketing-common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: "concert",
        price: 99,
        userId: "fake_user",
    });
    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, ticket, data, msg, orderId };
};

it("updates the ticket, publishes an event, and acknowledges the message", async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();

    expect(msg.ack).toHaveBeenCalled();

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
