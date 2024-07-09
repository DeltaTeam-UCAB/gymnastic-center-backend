import { Optional } from '@mono/types-utils'
import { CategoryRepository } from 'src/blog/application/repositories/category.repository'
import { Category } from 'src/blog/domain/entities/category'
import { CategoryId } from 'src/blog/domain/value-objects/category.id'
import { CategoryName } from 'src/blog/domain/value-objects/category.name'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'

export class CategoryRedisRepositoryProxy implements CategoryRepository {
    constructor(private categoryRepository: CategoryRepository) {}
    async getById(id: CategoryId): Promise<Optional<Category>> {
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

    existById(id: CategoryId): Promise<boolean> {
        return this.categoryRepository.existById(id)
    }
}
