import { InjectRepository } from '@nestjs/typeorm'
import { Blog as BlogORM } from '../../models/postgres/blog.entity'
import { Repository } from 'typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogImage } from '../../models/postgres/blog-images.entity'
import { BlogRepository } from 'src/blog/application/repositories/blog.repository'
import { Optional } from '@mono/types-utils'
import { Blog } from 'src/blog/application/models/blog'
import { Injectable } from '@nestjs/common'
import { BlogTag } from '../../models/postgres/blog-tag.entity'
import { Tag } from '../../models/postgres/tag.entity'

@Injectable()
export class BlogPostgresRepository implements BlogRepository {
    constructor(
        @InjectRepository(BlogORM)
        private blogProvider: Repository<BlogORM>,

        @InjectRepository(BlogImage)
        private blogImagesProvider: Repository<BlogImage>,

        @InjectRepository(BlogTag)
        private blogTagsProvider: Repository<BlogTag>,

        @InjectRepository(Tag)
        private tagsProvider: Repository<Tag>,
    ) {}
    async save(blogs: Blog): Promise<Result<Blog>> {
        await this.blogProvider.upsert(this.blogProvider.create(blogs), ['id'])
        await this.blogImagesProvider.delete({ blogId: blogs.id })
        const blogImagesEntities = blogs.images.map((imageId) => {
            const id = crypto.randomUUID()
            const blogImagesEntity = new BlogImage()
            blogImagesEntity.id = id
            blogImagesEntity.blogId = blogs.id
            blogImagesEntity.imageId = imageId
            return blogImagesEntity
        })
        await this.blogImagesProvider.upsert(
            this.blogImagesProvider.create(blogImagesEntities),
            ['id'],
        )
        return Result.success(blogs)
    }

    existByTitle(title: string): Promise<boolean> {
        return this.blogProvider.existsBy({
            title,
        })
    }

    async getById(id: string): Promise<Optional<Blog>> {
        const blog = await this.blogProvider.findOneBy({ id })
        const images = await this.blogImagesProvider.findBy({
            blogId: blog!.id,
        })
        const imagesIds = images.map((img) => img.imageId)
        const tags = await this.blogTagsProvider.findBy({
            blogId: blog!.id,
        })
        const imagesTags = await tags.asyncMap(
            async (tag) =>
                (await this.tagsProvider.findOneBy({ id: tag.tagId }))!.name,
        )
        return {
            ...blog!,
            tags: imagesTags,
            images: imagesIds,
        }
    }

    async getAll(limit?: number, offset?: number): Promise<Blog[]> {
        const blogs = await this.blogProvider.find({
            take: limit,
            skip: offset,
        })
        const blogsWithImages = await Promise.all(
            blogs.map(async (blog) => {
                const images = await this.blogImagesProvider.findBy({
                    blogId: blog.id,
                })
                const imageIds = images.map((img) => img.imageId)
                const tags = await this.blogTagsProvider.findBy({
                    blogId: blog!.id,
                })
                const imagesTags = await tags.asyncMap(
                    async (tag) =>
                        (await this.tagsProvider.findOneBy({ id: tag.tagId }))!
                            .name,
                )
                return {
                    ...blog,
                    tags: imagesTags,
                    images: imageIds,
                }
            }),
        )
        return blogsWithImages
    }
}
