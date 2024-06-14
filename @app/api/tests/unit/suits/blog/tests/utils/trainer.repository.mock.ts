import { Optional } from '@mono/types-utils'
import { Category } from '../../../../../../src/blog/application/models/category'
import { TrainerRepository } from '../../../../../../src/blog/application/repositories/trainer.repository'
import { Trainer } from '../../../../../../src/blog/application/models/trainer'

export class TrainerRepositoryMock implements TrainerRepository {
    constructor(private trainers: Trainer[] = []) {}

    async existsById(id: string): Promise<boolean> {
        return this.trainers.some((c) => c.id === id)
    }
    async getById(id: string): Promise<Optional<Category>> {
        return this.trainers.find((c) => c.id === id)
    }
}
