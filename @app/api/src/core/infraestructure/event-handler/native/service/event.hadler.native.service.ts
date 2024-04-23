import { EventHandler } from 'src/core/application/event-handler/event.handler'
import { Injectable } from '@nestjs/common'
import { Subscription } from 'src/core/application/event-handler/subscription'
import {
    DomainEventBase,
    DomainEventRecord,
} from 'src/core/domain/events/event'

@Injectable()
export class EventHandlerNative implements EventHandler {
    #subscribers: {
        [name: string]: ((e: DomainEventBase) => Promise<void>)[]
    } = {}
    publish(events: DomainEventBase[]): void {
        events.forEach((event) =>
            this.#subscribers[event.name]?.forEach((sub) => sub(event)),
        )
    }

    subscribe<T extends keyof DomainEventRecord>(
        name: T,
        callback: (event: DomainEventRecord[T]) => Promise<void>,
    ): Subscription {
        if (!this.#subscribers[name]) this.#subscribers[name] = []
        this.#subscribers[name].push(callback)
        return {
            unsubscribe: () => {
                this.#subscribers[name] = this.#subscribers[name].filter(
                    (e) => e !== callback,
                )
            },
        }
    }
}
