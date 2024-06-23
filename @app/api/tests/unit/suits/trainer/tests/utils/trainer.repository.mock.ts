import { Optional } from '@mono/types-utils'
import { Trainer } from '../../../../../../src/trainer/domain/trainer'
import { TrainerRepository } from '../../../../../../src/trainer/application/repositories/trainer.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { ClientID } from '../../../../../../src/trainer/domain/value-objects/client.id'
import { TrainerID } from '../../../../../../src/trainer/domain/value-objects/trainer.id'
import { TrainerName } from '../../../../../../src/trainer/domain/value-objects/trainer.name'

export class TrainerRepositoryMock implements TrainerRepository {
    constructor(private trainers: Trainer[] = []) {}
    async getAllFilteredByFollowed(
        perPage: number,
        page: number,
        clientId: ClientID,
    ): Promise<Trainer[]> {
        return []
    }
    async getAll(perPage: number, page: number): Promise<Trainer[]> {
        return []
    }

    async save(trainer: Trainer): Promise<Result<Trainer>> {
        this.trainers = this.trainers.filter((e) => e.id != trainer.id)
        this.trainers.push(trainer)
        return Result.success(trainer)
    }
    async getById(id: TrainerID): Promise<Optional<Trainer>> {
        console.log
        return this.trainers.find((e) => e.id == id)
    }
    async existByName(name: TrainerName): Promise<boolean> {
        return !!this.trainers.findMap((e) => e.name == name)
    }
    async followTrainer(
        userId: ClientID,
        trainerId: TrainerID,
    ): Promise<Result<boolean>> {
        const trainer = this.trainers.find((e) => e.id == trainerId)
        trainer?.addFollower(userId)
        return Result.success(true)
    }
    async unfollowTrainer(
        userId: ClientID,
        trainerId: TrainerID,
    ): Promise<Result<boolean>> {
        const trainer = this.trainers.find((e) => e.id == trainerId) as Trainer
        trainer.removeFollower(userId)
        return Result.success(false)
    }
}
