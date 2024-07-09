import { Optional } from '@mono/types-utils'
import { CategoryRepository } from 'src/course/application/repositories/category.repository'
import { Category } from 'src/course/domain/entities/category'
import { CategoryName } from 'src/course/domain/value-objects/category.name'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'
import { CategoryID } from 'src/course/domain/value-objects/category.id'

export class CategoryRedisRepositoryProxy implements CategoryRepository {
    constructor(private categoryRepository: CategoryRepository) {}
    async getById(id: CategoryID): Promise<Optional<Category>> {
        const possibleCategory = (await redisClient.hGetAll(
            'category:' + id.id,
        )) as Optional<{
            id: string
            name: string
        }>
        if (possibleCategory?.id) {
            return new Category(id, {
                name: new CategoryName(possibleCategory.name),
            })
        }
        const category = await this.categoryRepository.getById(id)
        if (category) {
            await redisClient.hSet('category:' + id.id, {
                id: id.id,
                name: category.name.name,
            })
        }
        return category
    }

    existById(id: CategoryID): Promise<boolean> {
        return this.categoryRepository.existById(id)
    }
}
