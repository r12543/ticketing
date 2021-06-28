import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import {
    OrderCancelledEvent,
    OrderStatus,
} from "@bohemian_org/ticketing-common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        userId: "fake_user",
        status: OrderStatus.Created,
        version: 0,
    });
    await order.save();

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: 1,
        ticket: {
            id: "ticket_id",
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, order, data, msg };
};

it("cancels the order and acknowledges the message", async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

    expect(msg.ack).toHaveBeenCalled();
});
