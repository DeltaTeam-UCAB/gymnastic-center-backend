import { MongooseModule } from '@nestjs/mongoose'
import { ServiceModule } from '../../decorators/service.module'
import { EventStorageMongoService } from './mongo.event.storage.service'
import { DomainEvent, DomainEventSchema } from './model/event'

export const MONGO_EVENT_STORAGE = 'MONGO_EVENT_STORAGE'

@ServiceModule(
    [
        {
            provide: MONGO_EVENT_STORAGE,
            useClass: EventStorageMongoService,
        },
    ],
    [
        MongooseModule.forFeature([
            {
                name: DomainEvent.name,
                schema: DomainEventSchema,
            },
        ]),
    ],
)
export class MongoEventStorageModule {}
