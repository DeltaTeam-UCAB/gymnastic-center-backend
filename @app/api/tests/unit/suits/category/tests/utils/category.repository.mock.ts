import { Optional } from '@mono/types-utils'
import { Category } from '../../../../../../src/category/application/models/category'
import { CategoryRepository } from '../../../../../../src/category/application/repositories/category.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'

export class CategoryRepositoryMock implements CategoryRepository {
    constructor(private categories: Category[] = []) {}
    async save(category: Category): Promise<Result<Category>> {
        this.categories = this.categories.filter((e) => e.id !== category.id)
        this.categories.push(category)
        return Result.success(category)
    }

    async findByName(name: string): Promise<Optional<Category>> {
        return this.categories.find((e) => e.name === name)
    }
}
