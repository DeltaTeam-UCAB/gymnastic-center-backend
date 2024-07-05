import { Optional } from '@mono/types-utils'
import { Blog } from '../models/blog'

export interface BlogRepository {
    getById(id: string): Promise<Optional<Blog>>
}
