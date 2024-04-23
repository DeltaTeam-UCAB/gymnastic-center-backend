import { Entity } from '../entity/entity'
import { DomainEventBase } from '../events/event'
import { ValueObject } from '../value-objects/value.object'

export abstract class AggregateRoot<
    T extends ValueObject<T>,
> extends Entity<T> {
    private events: DomainEventBase[] = []

    pullEvents(): DomainEventBase[] {
        const temp = this.events
        this.events = []
        return temp
    }

    protected publish(event: DomainEventBase) {
        this.validateState()
        this.events.push(event)
    }

    abstract validateState(): void
}
