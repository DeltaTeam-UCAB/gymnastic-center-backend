import { InjectRepository } from '@nestjs/typeorm'
import { Posts as PostORM } from '../../models/postgres/post.entity'
import { Repository } from 'typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { PostImages } from '../../models/postgres/post-images.entity'
import { BlogRepository } from 'src/blog/application/repositories/blog.repository'
import { Optional } from '@mono/types-utils'
import { Blog } from 'src/blog/application/models/blog'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BlogPostgresRepository implements BlogRepository {
    constructor(
        @InjectRepository(PostORM)
        private blogProvider: Repository<PostORM>,

        @InjectRepository(PostImages)
        private blogImagesProvider: Repository<PostImages>,
    ) {}
    async save(blogs: Blog): Promise<Result<Blog>> {
        await this.blogProvider.upsert(this.blogProvider.create(blogs), ['id'])
        const id = crypto.randomUUID()
        const blogImagesEntities = blogs.images.map((imageId) => {
            const blogImagesEntity = new PostImages()
            blogImagesEntity.id = id
            blogImagesEntity.postId = blogs.id
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
        const blog = await this.blogProvider
            .findOneBy({
                id,
            })
            .map((img) =>
                this.blogImagesProvider.findOneByOrFail({
                    id: (img as PostImages).id,
                }),
            )
        return blog
    }
}
