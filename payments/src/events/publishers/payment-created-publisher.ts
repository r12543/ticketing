import {
    Publisher,
    PaymentCreatedEvent,
    Subjects,
} from "@bohemian_org/ticketing-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
