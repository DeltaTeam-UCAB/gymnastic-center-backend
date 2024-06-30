import { Optional } from '@mono/types-utils'
import { CategoryRepository } from '../../../../../../src/blog/application/repositories/category.repository'
import { Category } from '../../../../../../src/blog/domain/entities/category'
import { CategoryId } from '../../../../../../src/blog/domain/value-objects/category.id'

export class CategoryRepositoryMock implements CategoryRepository {
    constructor(private categories: Category[] = []) {}

    async existById(id: CategoryId): Promise<boolean> {
        return this.categories.some((c) => c.id == id)
    }
    async getById(id: CategoryId): Promise<Optional<Category>> {
        return this.categories.find((c) => c.id == id)
    }
}
