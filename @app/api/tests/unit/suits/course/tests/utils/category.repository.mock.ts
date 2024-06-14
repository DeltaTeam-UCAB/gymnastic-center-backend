import { Optional } from '@mono/types-utils'
import { Category } from '../../../../../../src/course/application/models/category'
import { CategoryRepository } from '../../../../../../src/course/application/repositories/category.repository'

export class CategoryRepositoryMock implements CategoryRepository {
    constructor(private categories: Category[] = []) {}
    async getById(id: string): Promise<Optional<Category>> {
        return this.categories.find((e) => e.id === id)
    }

    async existById(id: string): Promise<boolean> {
        return this.categories.some((e) => e.id === id)
    }
}
