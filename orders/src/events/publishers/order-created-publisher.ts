import {
    Publisher,
    OrderCreatedEvent,
    Subjects,
} from "@bohemian_org/ticketing-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
