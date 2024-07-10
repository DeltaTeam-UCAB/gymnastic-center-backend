import { Injectable } from '@nestjs/common'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import {
    TRAINER_DELETED,
    trainerDeleted,
} from '../../../domain/events/trainer.deleted'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'

@Injectable()
export class TrainerDeletedSyncCacheEventListener {
    constructor(private eventHandle: RabbitMQEventHandler) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            TRAINER_DELETED,
            TRAINER_DELETED + '_SYNC_CACHE',
            (json) =>
                trainerDeleted({
                    id: new TrainerID(json.id._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await redisClient.del('trainer:' + event.id.id)
            },
        )
    }
}
