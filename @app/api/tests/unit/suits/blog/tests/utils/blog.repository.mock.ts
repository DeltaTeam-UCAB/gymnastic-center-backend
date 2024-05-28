import { Optional } from '@mono/types-utils'
import { Blog } from '../../../../../../src/blog/application/models/blog'
import { BlogRepository } from '../../../../../../src/blog/application/repositories/blog.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'

export class BlogRepositoryMock implements BlogRepository {
    constructor(private blogs: Blog[] = []) {}
    async save(blog: Blog): Promise<Result<Blog>> {
        this.blogs.push(blog)
        return Result.success(blog)
    }

    async existByTitle(title: string): Promise<boolean> {
        return this.blogs.some((e) => e.title === title)
    }

    async getById(id: string): Promise<Optional<Blog>> {
        return this.blogs.find((e) => e.id === id)
    }

    async getAll(): Promise<Blog[]> {
        return structuredClone(this.blogs)
    }
}