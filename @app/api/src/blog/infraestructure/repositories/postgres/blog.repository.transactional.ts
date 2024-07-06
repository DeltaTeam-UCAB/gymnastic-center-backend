import { Optional } from '@mono/types-utils'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogRepository } from 'src/blog/application/repositories/blog.repository'
import { Blog as BlogORM } from '../../models/postgres/blog.entity'
import { QueryRunner } from 'typeorm'
import { Tag } from '../../models/postgres/tag.entity'
import { randomUUID } from 'crypto'
import { BlogTag } from '../../models/postgres/blog-tag.entity'
import { BlogImage } from '../../models/postgres/blog-images.entity'
import { GetAllBlogsDTO } from 'src/blog/application/queries/getAll/types/dto'
import { Blog } from 'src/blog/domain/blog'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'
import { BlogTitle } from 'src/blog/domain/value-objects/blog.title'
import { BlogImage as BlogImageID } from 'src/blog/domain/value-objects/blog.images'
import { BlogTag as BlogTagID } from 'src/blog/domain/value-objects/blog.tag'
import { BlogBody } from 'src/blog/domain/value-objects/blog.body'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'
import { BlogDate } from 'src/blog/domain/value-objects/blog.date'
import { CategoryId } from 'src/blog/domain/value-objects/category.id'
import { Trainer } from 'src/blog/domain/entities/trainer'
import { TrainerName } from 'src/blog/domain/value-objects/trainer.name'
import { Category } from 'src/blog/domain/entities/category'
import { CategoryName } from 'src/blog/domain/value-objects/category.name'

export class BlogPostgresTransactionalRepository implements BlogRepository {
    constructor(private queryRunner: QueryRunner) {}

    async save(blog: Blog): Promise<Result<Blog>> {
        await this.queryRunner.manager.upsert(
            BlogORM,
            this.queryRunner.manager.create(BlogORM, {
                id: blog.id.id,
                title: blog.title.title,
                body: blog.body.body,
                trainer: blog.trainer.id.id,
                category: blog.category.id.id,
                date: blog.date.date,
            }),
            ['id'],
        )

        const tagIds = await blog.tags.asyncMap(async (name) => {
            const tagEntity = await this.queryRunner.manager.findOneBy(Tag, {
                name: name.tag,
            })
            if (tagEntity) return tagEntity.id
            const tagId = randomUUID()
            await this.queryRunner.manager.insert(Tag, {
                id: tagId,
                name: name.tag,
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
                blogId: blog.id.id,
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
                blogId: blog.id.id,
                imageId: e.image,
            })),
        )
        return Result.success(blog)
    }

    async getById(id: BlogId): Promise<Optional<Blog>> {
        const blog = await this.queryRunner.manager.findOneBy(BlogORM, {
            id: id.id,
            active: true,
        })
        if (!blog) return undefined

        const images = await this.queryRunner.manager.findBy(BlogImage, {
            blogId: blog.id,
        })
        const imagesIds = images.map((img) => new BlogImageID(img.imageId))

        const tags = await this.queryRunner.manager.findBy(BlogTag, {
            blogId: blog.id,
        })
        const tagsIds = await Promise.all(
            tags.map(async (tag) => {
                const tagEntity =
                    await this.queryRunner.manager.findOneByOrFail(Tag, {
                        id: tag.tagId,
                    })
                return new BlogTagID(tagEntity.name)
            }),
        )
        const category = await this.queryRunner.manager.findOneBy(Category, {
            id: new CategoryId(blog.category),
        })
        if (!category) throw new Error('Category not found')
        const categoryId = new CategoryId(category.id.id)

        const trainer = await this.queryRunner.manager.findOneBy(Trainer, {
            id: new TrainerId(blog.trainer),
        })
        if (!trainer) throw new Error('Trainer not found')
        const trainerId = new TrainerId(trainer.id.id)
        return new Blog(new BlogId(blog.id), {
            title: new BlogTitle(blog.title),
            body: new BlogBody(blog.body),
            images: imagesIds,
            tags: tagsIds,
            trainer: new Trainer(trainerId, {
                name: new TrainerName(trainer.name.name),
            }),
            category: new Category(categoryId, {
                name: new CategoryName(category.name.name),
            }),
            date: new BlogDate(blog.date),
        })
    }

    async existByTitle(title: BlogTitle): Promise<boolean> {
        const blog = await this.queryRunner.manager.existsBy(BlogORM, {
            title: title.title,
            active: true,
        })
        return blog
    }

    async getAll(filters: GetAllBlogsDTO): Promise<Blog[]> {
        const blogs = await this.queryRunner.manager.find(BlogORM, {
            skip: filters.perPage * (filters.page - 1),
            take: filters.perPage,
            where: {
                trainer: filters.trainer,
                category: filters.category,
                active: true,
            },
        })
        const blogResult = await Promise.all(
            blogs.map(async (blog) => {
                const trainer = await this.queryRunner.manager.findOneBy(
                    Trainer,
                    { id: new TrainerId(blog.trainer) },
                )
                if (!trainer) throw new Error('Trainer not found')
                const trainerId = new TrainerId(trainer.id.id)

                const category = await this.queryRunner.manager.findOneBy(
                    Category,
                    { id: new CategoryId(blog.category) },
                )
                if (!category) throw new Error('Category not found')
                const categoryId = new CategoryId(category.id.id)

                return new Blog(new BlogId(blog.id), {
                    title: new BlogTitle(blog.title),
                    body: new BlogBody(blog.body),
                    trainer: new Trainer(trainerId, {
                        name: new TrainerName(trainer.name.name),
                    }),
                    category: new Category(categoryId, {
                        name: new CategoryName(category.name.name),
                    }),
                    date: new BlogDate(blog.date),
                    images: [],
                    tags: [],
                })
            }),
        )
        return blogResult
    }

    async countByTrainer(id: TrainerId): Promise<number> {
        return this.queryRunner.manager.countBy(BlogORM, {
            trainer: id.id,
            active: true,
        })
    }

    async countByCategory(id: CategoryId): Promise<number> {
        return this.queryRunner.manager.countBy(BlogORM, {
            category: id.id,
            active: true,
        })
    }

    async delete(blog: Blog): Promise<Result<Blog>> {
        const blogORM = await this.queryRunner.manager.findOneByOrFail(
            BlogORM,
            {
                id: blog.id.id,
            },
        )
        blogORM.active = false
        await this.queryRunner.manager.save(blogORM)
        return Result.success(blog)
    }

    async getAllByTrainer(trainer: TrainerId): Promise<Blog[]> {
        const blogs = await this.queryRunner.manager.find(BlogORM, {
            where: {
                trainer: trainer.id,
                active: true,
            },
        })
        const blogResult = await Promise.all(
            blogs.map(async (blog) => {
                const trainer = await this.queryRunner.manager.findOneBy(
                    Trainer,
                    { id: new TrainerId(blog.trainer) },
                )
                if (!trainer) throw new Error('Trainer not found')
                const trainerId = new TrainerId(trainer.id.id)

                const category = await this.queryRunner.manager.findOneBy(
                    Category,
                    { id: new CategoryId(blog.category) },
                )
                if (!category) throw new Error('Category not found')
                const categoryId = new CategoryId(category.id.id)

                return new Blog(new BlogId(blog.id), {
                    title: new BlogTitle(blog.title),
                    body: new BlogBody(blog.body),
                    trainer: new Trainer(trainerId, {
                        name: new TrainerName(trainer.name.name),
                    }),
                    category: new Category(categoryId, {
                        name: new CategoryName(category.name.name),
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
