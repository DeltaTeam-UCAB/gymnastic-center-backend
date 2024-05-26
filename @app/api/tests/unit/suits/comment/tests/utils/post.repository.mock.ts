import { PostRepository } from '../../../../../../src/comment/application/repositories/post.repository'

export class PostRepositoryMock implements PostRepository {
    constructor(private posts: string[] = []) {}

    async existsById(id: string): Promise<boolean> {
        const exists = this.posts.includes(id)
        return exists
    }
}
