import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus,
} from "@bohemian_org/ticketing-common";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
    "/api/payments",
    requireAuth,
    [
        body("token").not().isEmpty().withMessage("token is required"),
        body("orderId").not().isEmpty().withMessage("orderId is required"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("Cannot pay for an cancelled order");
        }

        // need customer id, it should come from the frontend
        // const charge = await stripe.charges.create({
        //     currency: "usd",
        //     amount: order.price * 100,
        //     source: token,
        //     description: "Test",
        //     customer: "cus_JkwwUsC8w7lK4T",
        // });
        const charge = { id: "random" };

        const payment = Payment.build({ orderId, stripeId: charge.id });
        await payment.save();

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId,
        });

        res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter };
