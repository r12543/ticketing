import {
    Publisher,
    TicketCreatedEvent,
    Subjects,
} from "@bohemian_org/ticketing-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
