import { Optional } from '@mono/types-utils'
import { Category } from '../../../../../../src/course/domain/entities/category'
import { CategoryRepository } from '../../../../../../src/course/application/repositories/category.repository'
import { CategoryID } from '../../../../../../src/course/domain/value-objects/category.id'

export class CategoryRepositoryMock implements CategoryRepository {
    constructor(private categories: Category[] = []) {}
    async getById(id: CategoryID): Promise<Optional<Category>> {
        return this.categories.find((e) => e.id == id)
    }

    async existById(id: CategoryID): Promise<boolean> {
        return this.categories.some((e) => e.id == id)
    }
}
