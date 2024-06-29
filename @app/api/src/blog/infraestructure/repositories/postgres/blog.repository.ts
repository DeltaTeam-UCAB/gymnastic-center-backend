import { InjectRepository } from '@nestjs/typeorm'
import { Blog as BlogORM } from '../../models/postgres/blog.entity'
import { Repository } from 'typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogImage } from '../../models/postgres/blog-images.entity'
import { BlogRepository } from 'src/blog/application/repositories/blog.repository'
import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { BlogTag } from '../../models/postgres/blog-tag.entity'
import { Tag } from '../../models/postgres/tag.entity'
import { GetAllBlogsDTO } from 'src/blog/application/queries/getAll/types/dto'
import { BlogTitle } from 'src/blog/domain/value-objects/blog.title'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'
import { BlogImage as BlogImageID } from 'src/blog/domain/value-objects/blog.images'
import { BlogTag as BlogTagID } from 'src/blog/domain/value-objects/blog.tag'
import { Blog } from 'src/blog/domain/blog'
import { BlogBody } from 'src/blog/domain/value-objects/blog.body'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'
import { Trainer as TrainerORM } from '../../models/postgres/trainer.entity'
import { Category as CategoryORM } from '../../models/postgres/category.entity'
import { BlogDate } from 'src/blog/domain/value-objects/blog.date'
import { CategoryId } from 'src/blog/domain/value-objects/category.id'
import { Trainer } from 'src/blog/domain/entities/trainer'
import { TrainerName } from 'src/blog/domain/value-objects/trainer.name'
import { Category } from 'src/blog/domain/entities/category'
import { CategoryName } from 'src/blog/domain/value-objects/category.name'

@Injectable()
export class BlogPostgresRepository implements BlogRepository {
    constructor(
        @InjectRepository(BlogORM)
        private blogRepository: Repository<BlogORM>,

        @InjectRepository(BlogImage)
        private blogImagesRepository: Repository<BlogImage>,

        @InjectRepository(BlogTag)
        private blogTagsRepository: Repository<BlogTag>,

        @InjectRepository(Tag)
        private tagsRepository: Repository<Tag>,

        @InjectRepository(TrainerORM)
        private trainerRepository: Repository<TrainerORM>,

        @InjectRepository(CategoryORM)
        private categoryRepository: Repository<CategoryORM>,
    ) {}

    async save(blogs: Blog): Promise<Result<Blog>> { //preguntar si hay que hacer la relacion con el trainer y category
        await this.blogRepository.upsert(
            this.blogRepository.create(new BlogId(blogs.id.id)),
            ['id'],
        )
        await this.blogImagesRepository.delete({ blogId: blogs.id.id })
        const blogImagesEntities = blogs.images.map((imageId) => {
            const id = crypto.randomUUID()
            const blogImagesEntity = new BlogImage()
            blogImagesEntity.id = id
            blogImagesEntity.blogId = blogs.id.id
            blogImagesEntity.imageId = imageId.image
            return blogImagesEntity
        })
        await this.blogImagesRepository.upsert(
            this.blogImagesRepository.create(blogImagesEntities),
            ['id'],
        )
        await this.blogTagsRepository.delete({ tagId: blogs.id.id })
        const blogTagsEntities = blogs.tags.map((tagId) => {
            const blogTagsEntity = new BlogTag()
            blogTagsEntity.blogId = blogs.id.id
            blogTagsEntity.tagId = tagId.tag
            return blogTagsEntity
        })
        await this.blogTagsRepository.upsert(
            this.blogTagsRepository.create(blogTagsEntities),
            ['id'],
        )
        return Result.success(blogs)
    }

    async existByTitle(title: BlogTitle): Promise<boolean> {
        const blog = await this.blogRepository.existsBy({
            title: title.title,
        })
        return blog
    }

    async getById(id: BlogId): Promise<Optional<Blog>> {
        const blog = await this.blogRepository.findOneBy({ id: id.id })
        if (!blog) {
            return null
        }

        const images = await this.blogImagesRepository.findBy({
            blogId: blog.id,
        })
        const imagesIds = images.map((img) => new BlogImageID(img.imageId))

        const tags = await this.blogTagsRepository.findBy({ blogId: blog.id })
        const tagsIds = await tags.asyncMap(
            async (tag) =>
                new BlogTagID(
                    (await this.tagsRepository.findOneBy({
                        id: tag.tagId,
                    }))!.name,
                ),
        )

        const category = await this.categoryRepository.findOneBy({
            id: blog.category,
        })
        if (!category) throw new Error('Category not found')
        const categoryId = new CategoryId(category.id)

        const trainer = await this.trainerRepository.findOneBy({
            id: blog.trainer,
        })
        if (!trainer) throw new Error('Trainer not found')
        const trainerId = new TrainerId(trainer.id)

        return new Blog(new BlogId(blog.id), {
            title: new BlogTitle(blog.title),
            body: new BlogBody(blog.body),
            images: imagesIds,
            tags: tagsIds,
            trainer: new Trainer(trainerId, {
                name: new TrainerName(trainer.name),
            }),
            category: new Category(categoryId, {
                name: new CategoryName(category.name),
            }),
            date: new BlogDate(blog.date),
        })
}

    async getAll(filters: GetAllBlogsDTO): Promise<Blog[]> {
        const blogs = await this.blogRepository.find({
            take: filters.perPage,
            skip: filters.perPage * (filters.page - 1),
            where: {
                trainer: filters.trainer,
                category: filters.category,
            },
        })
        const blogResult = await Promise.all(
            blogs.map(async (blog) => {
                const trainer = await this.trainerRepository.findOneBy({
                    id: blog.trainer,
                })
                if (!trainer) throw new Error('Trainer not found')
                const trainerId = new TrainerId(trainer.id)

                const category = await this.categoryRepository.findOneBy({
                    id: blog.category,
                })
                if (!category) throw new Error('Category not found')
                const categoryId = new CategoryId(category!.id)

                return new Blog(new BlogId(blog.id), {
                    title: new BlogTitle(blog.title),
                    body: new BlogBody(blog.body),
                    trainer: new Trainer(trainerId, {
                        name: new TrainerName(trainer.name),
                    }),
                    category: new Category(categoryId, {
                        name: new CategoryName(category!.name),
                    }),
                    date: new BlogDate(blog.date),
                    images: [],
                    tags: [],
                })
            }),
        )
        return blogResult
    }
}
