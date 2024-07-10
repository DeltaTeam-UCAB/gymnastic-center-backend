import { InjectRepository } from '@nestjs/typeorm'
import { Blog } from 'src/search/application/models/blog'
import {
    BlogRepository,
    SearchBlogsCriteria,
} from 'src/search/application/repositories/blog.repository'
import { Blog as BlogORM } from '../../models/postgres/blog.entity'
import { Repository } from 'typeorm'
import { BlogImage } from '../../models/postgres/blog-images.entity'
import { Trainer } from '../../models/postgres/trainer.entity'
import { Category } from '../../models/postgres/category.entity'
import { Tag } from '../../models/postgres/tag.entity'

export class BlogPostgresBySearchRepository implements BlogRepository {
    constructor(
        @InjectRepository(BlogORM)
        private blogProvider: Repository<BlogORM>,
        @InjectRepository(Trainer) private trainerProvider: Repository<Trainer>,
        @InjectRepository(Category)
        private categoryProvider: Repository<Category>,
        @InjectRepository(BlogImage)
        private blogImageProvider: Repository<BlogImage>,
        @InjectRepository(Tag)
        private tagProvider: Repository<Tag>,
    ) {}
    async getMany(criteria: SearchBlogsCriteria): Promise<Blog[]> {
        const tags = await (criteria.tags
            ? (JSON.parse(criteria.tags as any) as string[])
            : undefined
        )?.asyncMap(async (tag) => {
            const item = await this.tagProvider.findOneByOrFail({
                name: tag,
            })
            return item.id
        })
        const data = await this.blogProvider
            .createQueryBuilder('b')
            .where(
                `lower(b.title) like :term ${
                    tags && tags.isNotEmpty()
                        ? `and b.active = true and b.id in (select "blogId" from blog_tag where ${tags
                              ?.map((e) => `"tagId" = '${e}'`)
                              .join(' or ')})`
                        : ''
                }`,
                {
                    term: `%${criteria.term?.toLowerCase() ?? ''}%`,
                },
            )
            .skip(criteria.perPage * (criteria.page - 1))
            .take(criteria.perPage)
            .execute()
        return (data as Record<any, any>[]).asyncMap<Blog>(async (e) => ({
            id: e.b_id,
            title: e.b_title,
            date: new Date(e.b_date),
            image: (
                await this.blogImageProvider.findOneByOrFail({
                    blogId: e.b_id,
                })
            ).imageId,
            category: (
                await this.categoryProvider.findOneByOrFail({
                    id: e.b_category,
                })
            ).name,
            trainer: (
                await this.trainerProvider.findOneByOrFail({
                    id: e.b_trainer,
                })
            ).name,
        }))
    }
}
