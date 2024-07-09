import { Optional } from '@mono/types-utils'
import { TrainerRepository } from 'src/course/application/repositories/trainer.repository'
import { Trainer } from 'src/course/domain/entities/trainer'
import { TrainerName } from 'src/course/domain/value-objects/trainer.name'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'

export class TrainerRedisRepositoryProxy implements TrainerRepository {
    constructor(private trainerRepository: TrainerRepository) {}
    async getById(id: TrainerID): Promise<Optional<Trainer>> {
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

    existById(id: TrainerID): Promise<boolean> {
        return this.trainerRepository.existById(id)
    }
}
