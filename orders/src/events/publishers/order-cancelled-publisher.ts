import {
    Publisher,
    OrderCancelledEvent,
    Subjects,
} from "@bohemian_org/ticketing-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
