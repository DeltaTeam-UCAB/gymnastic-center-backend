import { Optional } from '@mono/types-utils'
import { Category } from '../models/category'

export interface CategoryRepository {
    getById(id: string): Promise<Optional<Category>>
}
