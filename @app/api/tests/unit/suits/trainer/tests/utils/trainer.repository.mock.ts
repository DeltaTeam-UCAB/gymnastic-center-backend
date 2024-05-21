import { Optional } from '@mono/types-utils'
import { Trainer } from '../../../../../../src/trainer/application/models/trainer'
import { TrainerRepository } from '../../../../../../src/trainer/application/repositories/trainer.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'

export class TrainerRepositoryMock implements TrainerRepository {
    constructor(private trainers: Trainer[] = []) {}

    async save(trainer: Trainer): Promise<Result<Trainer>> {
        this.trainers = this.trainers.filter((e) => e.id !== trainer.id)
        this.trainers.push(trainer)
        return Result.success(trainer)
    }
    async getById(id: string): Promise<Optional<Trainer>> {
        return this.trainers.find((e) => e.id === id)
    }
    async existByName(name: string): Promise<boolean> {
        return !!this.trainers.findMap((e) => e.name === name)
    }
    async followTrainer(
        userId: string,
        trainerId: string,
    ): Promise<Result<boolean>> {
        const trainer = this.trainers.find((e) => e.id === trainerId)
        trainer?.followers.push(userId)
        return Result.success(true)
    }
    async unfollowTrainer(
        userId: string,
        trainerId: string,
    ): Promise<Result<boolean>> {
        const trainer = this.trainers.find((e) => e.id === trainerId) as Trainer
        trainer.followers = trainer.followers.filter((e) => e !== userId)
        return Result.success(false)
    }
}
