import { Optional } from '@mono/types-utils'
import { Category } from '../../../../../../src/blog/application/models/category'
import { CategoryRepository } from '../../../../../../src/blog/application/repositories/category.repository'

export class CategoryRepositoryMock implements CategoryRepository {
    constructor(private categories: Category[] = []) {}

    async existById(id: string): Promise<boolean> {
        return this.categories.some((c) => c.id === id)
    }
    async getById(id: string): Promise<Optional<Category>> {
        return this.categories.find((c) => c.id === id)
    }
}
