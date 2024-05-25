import { PostRepository } from "../../../../../../src/post/application/repositories/post.repository"
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { Posts } from "../../../../../../src/post/application/models/posts"
import { Optional } from "@mono/types-utils"

export class PostRepositoryMock implements PostRepository {
    constructor(private posts: Posts[] = []) {}
    async save(post: Posts): Promise<Result<Posts>> {
        this.posts.push(post)
        return Result.success(post)
    }

    async existByTitle(title: string): Promise<Optional<Posts>> {
        return this.posts.find((e) => e.title === title)
    }
}