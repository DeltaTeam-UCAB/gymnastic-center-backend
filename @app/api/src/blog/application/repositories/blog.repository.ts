import { Result } from 'src/core/application/result-handler/result.handler'
import { Blog } from '../models/blog'
import { Optional } from '@mono/types-utils'

export interface BlogRepository {
    save(blog: Blog): Promise<Result<Blog>>
    existByTitle(title: string): Promise<boolean>
    getById(id: string): Promise<Optional<Blog>>
    getAll(limit?: number, offset?: number): Promise<Blog[]>
}
