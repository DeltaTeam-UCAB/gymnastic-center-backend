import { Optional } from '@mono/types-utils'
import { BlogRepository } from '../../../../../../src/blog/application/repositories/blog.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { Blog } from '../../../../../../src/blog/domain/blog'
import { BlogTitle } from '../../../../../../src/blog/domain/value-objects/blog.title'
import { BlogId } from '../../../../../../src/blog/domain/value-objects/blog.id'

export class BlogRepositoryMock implements BlogRepository {
    constructor(private blogs: Blog[] = []) {}
    async save(blog: Blog): Promise<Result<Blog>> {
        this.blogs = this.blogs.filter((b) => b.id == blog.id)
        this.blogs.push(blog)
        return Result.success(blog)
    }

    async existByTitle(title: BlogTitle): Promise<boolean> {
        return this.blogs.some((e) => e.title == title)
    }

    async getById(id: BlogId): Promise<Optional<Blog>> {
        return this.blogs.find((e) => e.id == id)
    }

    async getAll(): Promise<Blog[]> {
        return this.blogs.map(
            (blog) =>
                new Blog(blog.id, {
                    title: blog.title,
                    body: blog.body,
                    images: blog.images,
                    tags: blog.tags,
                    category: blog.category,
                    trainer: blog.trainer,
                    date: blog.date,
                }),
        )
    }
}