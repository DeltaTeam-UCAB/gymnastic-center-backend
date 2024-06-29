import { Optional } from '@mono/types-utils'
import { Category } from '../../domain/entities/category'
import { CategoryId } from 'src/blog/domain/value-objects/category.id'

export interface CategoryRepository {
    existById(id: CategoryId): Promise<boolean>
    getById(id: CategoryId): Promise<Optional<Category>>
}
