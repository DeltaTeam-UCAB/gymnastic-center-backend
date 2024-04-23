export interface DomainEventRecord {}

type EventBase = {
    timestamp?: Date
}

export type DomainEventBase = {
    name: string
    timestamp: Date
}

export type DomainEventInstance<T extends EventBase> = {
    readonly [Property in keyof T as Exclude<
        Property,
        'timestamp'
    >]: T[Property]
} & {
    readonly timestamp: Date
}

export function domainEventFactory<T extends EventBase>(name: string) {
    return (
        data: T,
    ): DomainEventInstance<
        T & {
            name: string
        }
    > => ({
        name,
        timestamp: new Date(),
        ...data,
    })
}
