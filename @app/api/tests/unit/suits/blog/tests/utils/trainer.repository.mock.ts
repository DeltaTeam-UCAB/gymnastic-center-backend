import { Optional } from '@mono/types-utils'
import { TrainerRepository } from '../../../../../../src/blog/application/repositories/trainer.repository'
import { TrainerId } from '../../../../../../src/blog/domain/value-objects/trainer.id'
import { Trainer } from '../../../../../../src/blog/domain/entities/trainer'

export class TrainerRepositoryMock implements TrainerRepository {
    constructor(private trainers: Trainer[] = []) {}

    async existsById(id: TrainerId): Promise<boolean> {
        return this.trainers.some((c) => c.id == id)
    }
    async getById(id: TrainerId): Promise<Optional<Trainer>> {
        return this.trainers.find((c) => c.id == id)
    }
}
