import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Trainer } from 'src/trainer/application/models/trainer'
import { TrainerRepository } from 'src/trainer/application/repositories/trainer.repository'
import { Trainer as TrainerORM } from '../../models/postgres/trainer.entity'
import { Repository } from 'typeorm'
import { Follow } from '../../models/postgres/follow.entity'

export class TrainerPostgresRepository implements TrainerRepository {
    constructor(
        @InjectRepository(TrainerORM)
        private trainerRepository: Repository<TrainerORM>,
        @InjectRepository(Follow)
        private followRepository: Repository<Follow>,
    ) {}

    async save(trainer: Trainer): Promise<Result<Trainer>> {
        await this.trainerRepository.upsert(
            this.trainerRepository.create(trainer),
            ['id'],
        )
        return Result.success(trainer)
    }

    async getById(id: string): Promise<Optional<Trainer>> {
        const trainer = await this.trainerRepository.findOneBy({
            id,
        })
        return trainer
    }

    async getFollowers(id: string): Promise<Optional<number>> {
        const followers = await this.followRepository.countBy({
            trainerId: id,
        })
        return followers
    }

    async isUserFollowing(
        userId: string,
        trainerId: string,
    ): Promise<Optional<boolean>> {
        const userFollow = await this.followRepository.existsBy({
            trainerId,
            userId,
        })
        return userFollow
    }

    async followTrainer(
        userId: string,
        trainerId: string,
    ): Promise<Result<boolean>> {
        this.followRepository.save({
            userId,
            trainerId,
        })
        return Result.success(true)
    }

    async unfollowTrainer(
        userId: string,
        trainerId: string,
    ): Promise<Result<boolean>> {
        this.followRepository.delete({
            userId,
            trainerId,
        })
        return Result.success(false)
    }
}
