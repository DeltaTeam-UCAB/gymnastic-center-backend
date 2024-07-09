import { Blog } from '../../../../../../src/blog/domain/blog'
import { Category } from '../../../../../../src/blog/domain/entities/category'
import { BlogBody } from '../../../../../../src/blog/domain/value-objects/blog.body'
import { BlogId } from '../../../../../../src/blog/domain/value-objects/blog.id'
import { BlogImage } from '../../../../../../src/blog/domain/value-objects/blog.images'
import { BlogTag } from '../../../../../../src/blog/domain/value-objects/blog.tag'
import { BlogTitle } from '../../../../../../src/blog/domain/value-objects/blog.title'
import { CategoryId } from '../../../../../../src/blog/domain/value-objects/category.id'
import { CategoryName } from '../../../../../../src/blog/domain/value-objects/category.name'
import { DateProviderMock } from '../../../blog/tests/utils/date.provider.mock'
import { Trainer } from '../../../../../../src/blog/domain/entities/trainer'
import { TrainerId } from '../../../../../../src/blog/domain/value-objects/trainer.id'
import { TrainerName } from '../../../../../../src/blog/domain/value-objects/trainer.name'
import { BlogDate } from '../../../../../../src/blog/domain/value-objects/blog.date'

const date = new DateProviderMock(new Date())
export const createBlog = (data: {
    id?: string
    title?: string
    body?: string
    images?: string[]
    tags?: string[]
    category?: string
    trainer?: string
    date?: Date
}) =>
    new Blog(new BlogId(data?.id ?? '84821c3f-0e66-4bf4-a3a8-520e42e50752'), {
        title: new BlogTitle(data?.title ?? 'test blog'),
        body: new BlogBody(data?.body ?? 'test made for blog body'),
        images: data.images?.map((img) => new BlogImage(img)) ?? [],
        tags: data.tags?.map((tag) => new BlogTag(tag)) ?? [],
        category: new Category(
            new CategoryId(
                data?.category ?? '84821c3f-0e66-4bf4-a3a8-520e42e54125',
            ),
            {
                name: new CategoryName('category name'),
            },
        ),
        trainer: new Trainer(
            new TrainerId(
                data?.trainer ?? '84821c3f-0e84-4bf4-a3a8-520e42e54121',
            ),
            {
                name: new TrainerName('trainer name'),
            },
        ),
        date: new BlogDate(data?.date ?? date.current),
    })
