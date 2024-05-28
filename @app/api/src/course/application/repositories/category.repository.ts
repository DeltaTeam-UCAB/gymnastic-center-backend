import { Optional } from '@mono/types-utils'
import { Category } from '../models/category'

export interface CategoryRepository {
    existById(id: string): Promise<boolean>
    getById(id: string): Promise<Optional<Category>>
}
