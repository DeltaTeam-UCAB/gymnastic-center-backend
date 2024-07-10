import { DomainEventBase } from 'src/core/domain/events/event'

export interface DomainEventStorage {
    save(event: DomainEventBase): Promise<void>
}
