import {
    DomainEventBase,
    DomainEventRecord,
} from 'src/core/domain/events/event'
import { Subscription } from './subscription'

export interface EventHandler {
    publish(events: DomainEventBase[]): void
    subscribe<T extends keyof DomainEventRecord>(
        name: T,
        callback: (event: DomainEventRecord[T]) => Promise<void>,
    ): Subscription
}

export interface EventPublisher {
    publish(events: DomainEventBase[]): void
}

export interface EventListener {
    subscribe<T extends DomainEventBase>(
        name: T,
        callback: (event: T) => Promise<void>,
    ): Subscription
}
