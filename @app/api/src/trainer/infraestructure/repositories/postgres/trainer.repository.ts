import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Trainer } from 'src/trainer/application/models/trainer'
import { TrainerRepository } from 'src/trainer/application/repositories/trainer.repository'
import { Trainer as TrainerORM } from '../../models/postgres/trainer.entity'
import { Repository } from 'typeorm'
import { Follow } from '../../models/postgres/follow.entity'
import { isNotNull } from 'src/utils/null-manager/null-checker'

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
        if (!isNotNull(trainer)) {
            return null
        }
        const follows = await this.followRepository.find({
            where: {
                trainerId: id,
            },
            select: {
                userId: true,
            },
        })
        const followers = follows.map((f) => f.userId)
        return {
            ...trainer,
            followers,
        }
    }

    async existByName(name: string): Promise<boolean> {
        const exists = await this.trainerRepository.existsBy({
            name,
        })
        return exists
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
