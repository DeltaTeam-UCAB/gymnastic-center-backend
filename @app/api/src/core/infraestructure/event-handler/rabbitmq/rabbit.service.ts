import { Injectable, Logger } from '@nestjs/common'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { DomainEventBase } from 'src/core/domain/events/event'
import amqp from 'amqplib'

const connection = await amqp.connect(process.env.QUEUE_URL ?? '')
const queues: Record<string, string[]> = {}

@Injectable()
export class RabbitMQEventHandler implements EventPublisher {
    publish(events: DomainEventBase[]): void {
        events.asyncForEach(async (event) => {
            const channel = await connection.createChannel()
            const queuesToPublish = queues[event.name] ?? []
            await queuesToPublish.asyncForEach(async (queue) => {
                await channel.assertQueue(queue, {
                    durable: false,
                })
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)))
            })
            await channel.close()
        })
    }
    async listen<T extends DomainEventBase>(
        name: string,
        queueName: string,
        mapper: (json: Record<any, any>) => T,
        callback: (e: T) => Promise<void>,
    ) {
        if (!queues[name]) queues[name] = []
        queues[name].push(queueName)
        const channel = await connection.createChannel()
        await channel.assertQueue(queueName, {
            durable: false,
        })
        await channel.consume(
            queueName,
            (data) => {
                if (!data) return
                new Logger('QUEUE ENTRY').log(queueName)
                callback(mapper(JSON.parse(data.content.toString())))
            },
            {
                noAck: true,
            },
        )
    }
}
