import { Optional } from '@mono/types-utils'
import { Result } from 'src/core/application/result-handler/result.handler'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'
import { TrainerRepository } from 'src/trainer/application/repositories/trainer.repository'
import { Trainer } from 'src/trainer/domain/trainer'
import { ClientID } from 'src/trainer/domain/value-objects/client.id'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { TrainerName } from 'src/trainer/domain/value-objects/trainer.name'

export class TrainerRedisRepositoryProxy implements TrainerRepository {
    constructor(private trainerRepository: TrainerRepository) {}
    save(trainer: Trainer): Promise<Result<Trainer>> {
        return this.trainerRepository.save(trainer)
    }

    getById(id: TrainerID): Promise<Optional<Trainer>> {
        return this.trainerRepository.getById(id)
    }

    getAll(perPage: number, page: number): Promise<Trainer[]> {
        return this.trainerRepository.getAll(perPage, page)
    }

    getAllFilteredByFollowed(
        perPage: number,
        page: number,
        clientId: ClientID,
    ): Promise<Trainer[]> {
        return this.trainerRepository.getAllFilteredByFollowed(
            perPage,
            page,
            clientId,
        )
    }

    countFollowsByClient(client: ClientID): Promise<number> {
        return this.trainerRepository.countFollowsByClient(client)
    }

    existByName(name: TrainerName): Promise<boolean> {
        return this.trainerRepository.existByName(name)
    }

    async delete(trainer: Trainer): Promise<Result<Trainer>> {
        const result = await this.trainerRepository.delete(trainer)
        if (!result.isError()) await redisClient.del('trainer:' + trainer.id.id)
        return result
    }
}
