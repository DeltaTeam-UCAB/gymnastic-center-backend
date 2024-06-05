import { BlogRepository } from '../../../../../../src/comment/application/repositories/blog.repository'

export class BlogRepositoryMock implements BlogRepository {
    constructor(private posts: string[] = []) {}

    async existsById(id: string): Promise<boolean> {
        const exists = this.posts.includes(id)
        return exists
    }
}
