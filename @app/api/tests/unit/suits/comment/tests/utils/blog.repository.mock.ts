import { BlogRepository } from '../../../../../../src/comment/application/repositories/blog.repository'
import { BlogID } from '../../../../../../src/comment/domain/value-objects/blog.id'

export class BlogRepositoryMock implements BlogRepository {
    constructor(private posts: string[] = []) {}

    async existsById(id: BlogID): Promise<boolean> {
        const exists = this.posts.includes(id.id)
        return exists
    }
}
