import { Optional } from '@mono/types-utils'
import { TrainerRepository } from 'src/blog/application/repositories/trainer.repository'
import { Trainer } from 'src/blog/domain/entities/trainer'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'
import { TrainerName } from 'src/blog/domain/value-objects/trainer.name'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'

export class TrainerRedisRepositoryProxy implements TrainerRepository {
    constructor(private trainerRepository: TrainerRepository) {}
    async getById(id: TrainerId): Promise<Optional<Trainer>> {
        const possibleTrainer = (await redisClient.hGetAll(
            'trainer:' + id.id,
        )) as Optional<{
            id: string
            name: string
        }>
        if (possibleTrainer?.id)
            return new Trainer(id, {
                name: new TrainerName(possibleTrainer.name),
            })
        const trainer = await this.trainerRepository.getById(id)
        if (trainer)
            await redisClient.hSet('trainer:' + id.id, {
                id: id.id,
                name: trainer.name.name,
            })
        return trainer
    }

    existsById(id: TrainerId): Promise<boolean> {
        return this.trainerRepository.existsById(id)
    }
}
