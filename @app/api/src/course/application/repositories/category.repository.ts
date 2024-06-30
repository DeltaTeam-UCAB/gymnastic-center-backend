import { Optional } from '@mono/types-utils'
import { Category } from 'src/course/domain/entities/category'
import { CategoryID } from 'src/course/domain/value-objects/category.id'

export interface CategoryRepository {
    existById(id: CategoryID): Promise<boolean>
    getById(id: CategoryID): Promise<Optional<Category>>
}
