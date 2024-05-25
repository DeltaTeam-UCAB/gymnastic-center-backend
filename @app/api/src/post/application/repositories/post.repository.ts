import { Result } from 'src/core/application/result-handler/result.handler'
import { Posts } from '../models/posts'
import { Optional } from '@mono/types-utils'

export interface PostRepository {
    save(post: Posts): Promise<Result<Posts>>
    existByTitle(title: string): Promise<Optional<Posts>>
}
