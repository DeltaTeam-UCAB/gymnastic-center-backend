import { Optional } from '@mono/types-utils'
import { Trainer } from '../../../../../../src/course/domain/entities/trainer'
import { TrainerRepository } from '../../../../../../src/course/application/repositories/trainer.repository'
import { TrainerID } from '../../../../../../src/course/domain/value-objects/trainer.id'

export class TrainerRepositoryMock implements TrainerRepository {
    constructor(private trainers: Trainer[] = []) {}
    async getById(id: TrainerID): Promise<Optional<Trainer>> {
        return this.trainers.find((e) => e.id == id)
    }

    async existById(id: TrainerID): Promise<boolean> {
        return this.trainers.some((e) => e.id == id)
    }
}
