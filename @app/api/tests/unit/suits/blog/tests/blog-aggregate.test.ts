import { Blog } from '../../../../../src/blog/domain/blog'
import { Category } from '../../../../../src/blog/domain/entities/category'
import { Trainer } from '../../../../../src/blog/domain/entities/trainer'
import { BlogBody } from '../../../../../src/blog/domain/value-objects/blog.body'
import { BlogDate } from '../../../../../src/blog/domain/value-objects/blog.date'
import { BlogId } from '../../../../../src/blog/domain/value-objects/blog.id'
import { BlogImage } from '../../../../../src/blog/domain/value-objects/blog.images'
import { BlogTag } from '../../../../../src/blog/domain/value-objects/blog.tag'
import { BlogTitle } from '../../../../../src/blog/domain/value-objects/blog.title'
import { CategoryId } from '../../../../../src/blog/domain/value-objects/category.id'
import { CategoryName } from '../../../../../src/blog/domain/value-objects/category.name'
import { TrainerId } from '../../../../../src/blog/domain/value-objects/trainer.id'
import { TrainerName } from '../../../../../src/blog/domain/value-objects/trainer.name'
import { DateProviderMock } from '../../blog/tests/utils/date.provider.mock'

export const name = 'Should create a blog aggregate'
const date = new DateProviderMock(new Date())
export const body = () => {
    const blog = new Blog(new BlogId('0c9b91f7-c739-4a88-9c94-594b5005ccb8'), {
        title: new BlogTitle('test title blog'),
        body: new BlogBody('test body'),
        images: [new BlogImage('2483a13e-12cd-4ece-9402-8c46b7bfb0a6')],
        tags: [new BlogTag('test tag')],
        trainer: new Trainer(
            new TrainerId('2c56cdc0-c3f5-4723-974b-82f1b67c25fd'),
            {
                name: new TrainerName('trainer name'),
            },
        ),
        category: new Category(
            new CategoryId('bec294c2-ccdc-4631-b72f-7bc4cf9be4e3'),
            {
                name: new CategoryName('category name'),
            },
        ),
        date: new BlogDate(date.current),
    })
    lookFor(blog).toBeDefined()
}
