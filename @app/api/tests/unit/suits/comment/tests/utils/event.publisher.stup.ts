import { EventPublisher } from '../../../../../../src/core/application/event-handler/event.handler'
import { DomainEventBase } from '../../../../../../src/core/domain/events/event'

export const eventPublisherStub = {
    events: [],
    publish(events) {
        this.events = events
    },
} satisfies EventPublisher & {
    events: DomainEventBase[]
}
