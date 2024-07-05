import { Injectable } from '@nestjs/common'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { DomainEventBase } from 'src/core/domain/events/event'
import amqp, { Channel } from 'amqplib'

const connection = await amqp.connect(process.env.QUEUE_URL ?? '')
const callbacks: Record<string, ((e: DomainEventBase) => Promise<void>)[]> = {}
const channels: Record<string, Channel> = {}

@Injectable()
export class RabbitMQEventHandler implements EventPublisher {
    publish(events: DomainEventBase[]): void {
        events.asyncForEach(async (event) => {
            const channel = await connection.createChannel()
            await channel.assertQueue(event.name, {
                durable: false,
            })
            channel.sendToQueue(event.name, Buffer.from(JSON.stringify(event)))
            await channel.close()
        })
    }
    async listen<T extends DomainEventBase>(
        name: string,
        mapper: (json: Record<any, any>) => T,
        callback: (e: T) => Promise<void>,
    ) {
        if (!callbacks[name]) callbacks[name] = []
        callbacks[name].push(callback)
        if (!channels[name]) {
            const channel = await connection.createChannel()
            await channel.assertQueue(name, {
                durable: false,
            })
            channels[name] = channel
            await channel.consume(
                name,
                (data) => {
                    if (!data) return
                    Object.values(callbacks[name]).forEach((callback) =>
                        callback(mapper(JSON.parse(data.content.toString()))),
                    )
                },
                {
                    noAck: true,
                },
            )
        }
    }
}
