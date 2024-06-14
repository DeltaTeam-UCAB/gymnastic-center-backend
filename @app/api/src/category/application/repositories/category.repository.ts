import { Result } from 'src/core/application/result-handler/result.handler'
import { Category } from '../models/category'
import { Optional } from '@mono/types-utils'

export type GetManyData = {
    page: number
    perPage: number
}

export interface CategoryRepository {
    save(category: Category): Promise<Result<Category>>
    findByName(name: string): Promise<Optional<Category>>
    getMany(data: GetManyData): Promise<Category[]>
}
