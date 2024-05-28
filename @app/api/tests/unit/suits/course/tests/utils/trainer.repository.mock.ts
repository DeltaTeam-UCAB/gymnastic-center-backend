import { Optional } from '@mono/types-utils'
import { Trainer } from '../../../../../../src/course/application/models/trainer'
import { TrainerRepository } from '../../../../../../src/course/application/repositories/trainer.repository'

export class TrainerRepositoryMock implements TrainerRepository {
    constructor(private trainers: Trainer[] = []) {}
    async getById(id: string): Promise<Optional<Trainer>> {
        return this.trainers.find((e) => e.id === id)
    }

    async existById(id: string): Promise<boolean> {
        return this.trainers.some((e) => e.id === id)
    }
}
