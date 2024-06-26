import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { DomainEventBase } from 'src/core/domain/events/event'
import { DomainEvent } from './model/event'
import { Model } from 'mongoose'

@Injectable()
export class EventStorageMongoService implements DomainEventStorage {
    constructor(
        @InjectModel(DomainEvent.name) private domainModel: Model<DomainEvent>,
    ) {}
    async save(event: DomainEventBase): Promise<void> {
        const { name, timestamp, ...rest } = event
        await this.domainModel.create({
            name,
            timestamp,
            data: rest,
        })
    }
}
