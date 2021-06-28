import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent,
} from "@bohemian_org/ticketing-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
