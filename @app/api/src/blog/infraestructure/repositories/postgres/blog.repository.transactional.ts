import { Optional } from '@mono/types-utils'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogRepository } from 'src/blog/application/repositories/blog.repository'
import { Blog as BlogORM } from '../../models/postgres/blog.entity'
import { QueryRunner } from 'typeorm'
import { Tag } from '../../models/postgres/tag.entity'
import { randomUUID } from 'crypto'
import { BlogTag } from '../../models/postgres/blog-tag.entity'
import { Blog } from 'src/blog/application/models/blog'
import { BlogImage } from '../../models/postgres/blog-images.entity'
import { GetAllBlogsDTO } from 'src/blog/application/queries/getAll/types/dto'

export class BlogPostgresTransactionalRepository implements BlogRepository {
    constructor(private queryRunner: QueryRunner) {}

    async save(blog: Blog): Promise<Result<Blog>> {
        await this.queryRunner.manager.upsert(
            BlogORM,
            this.queryRunner.manager.create(BlogORM, blog),
            ['id'],
        )

        const tagIds = await blog.tags.asyncMap(async (name) => {
            const tagEntity = await this.queryRunner.manager.findOneBy(Tag, {
                name,
            })
            if (tagEntity) return tagEntity.id
            const tagId = randomUUID()
            await this.queryRunner.manager.insert(Tag, {
                id: tagId,
                name,
            })
            return tagId
        })
        await this.queryRunner.manager
            .delete(BlogTag, {
                blogId: blog.id,
            })
            .catch(() => console.log('no tags'))
        await this.queryRunner.manager.insert(
            BlogTag,
            tagIds.map((e) => ({
                blogId: blog.id,
                tagId: e,
            })),
        )
        await this.queryRunner.manager
            .delete(BlogImage, {
                blogId: blog.id,
            })
            .catch(() => console.log('no tags'))
        await this.queryRunner.manager.insert(
            BlogImage,
            blog.images.map((e) => ({
                id: randomUUID(),
                blogId: blog.id,
                imageId: e,
            })),
        )
        return Result.success(blog)
    }

    async getById(id: string): Promise<Optional<Blog>> {
        const blog = await this.queryRunner.manager.findOneBy(BlogORM, {
            id,
        })
        if (!blog) return undefined
        return {
            ...blog,
            tags: await this.queryRunner.manager
                .findBy(BlogTag, {
                    blogId: blog.id,
                })
                .map(async (tagId) => {
                    const name = (
                        await this.queryRunner.manager.findOneByOrFail(Tag, {
                            id: tagId.tagId,
                        })
                    ).name
                    console.log(name)
                    return name
                }),
            images: await this.queryRunner.manager
                .findBy(BlogImage, {
                    blogId: blog.id,
                })
                .map(
                    async (imageId) =>
                        (
                            await this.queryRunner.manager.findOneByOrFail(
                                Tag,
                                {
                                    id: imageId.imageId,
                                },
                            )
                        ).name,
                ),
        }
    }

    existByTitle(title: string): Promise<boolean> {
        return this.queryRunner.manager.existsBy(BlogORM, {
            title,
        })
    }

    async getAll(filters: GetAllBlogsDTO): Promise<Blog[]> {
        const blogs = await this.queryRunner.manager.find(BlogORM, {
            skip: filters.perPage * (filters.page - 1),
            take: filters.perPage,
        })
        return blogs.map((e) => ({
            ...e,
            tags: [],
            images: [],
        }))
    }
}
