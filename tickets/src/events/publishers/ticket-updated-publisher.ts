import {
    Publisher,
    TicketUpdatedEvent,
    Subjects,
} from "@bohemian_org/ticketing-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
