import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { createBlog } from './utils/blog.factory'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { GetBlogByIdResponse } from '../../../../../src/blog/application/queries/getById/types/response'
import { GetBlogByIdQuery } from '../../../../../src/blog/application/queries/getById/getById.blog'
import { createTrainer } from './utils/trainer.factory'
import { createCategory } from './utils/category.factory'
import { createImage } from './utils/image.factory'
import { CategoryRepositoryMock } from './utils/category.repository.mock'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { ImageRepositoryMock } from './utils/image.repository.mock'
import { DateProviderMock } from '../../blog/tests/utils/date.provider.mock'

export const name = 'Should get blog by ID'
export const body = async () => {
    const date = new DateProviderMock(new Date())
    const blogId = '84821c3f-0e66-4bf4-a3a8-520e42e50753'
    const trainerId = '84821c3f-0e84-4bf4-a3a8-520e42e54121'
    const categoryId = '84821c3f-0e66-4bf4-a3a8-520e42e54125'
    const imageId = '84821c3f-0e66-4bf4-a3a8-520e42e54147'
    const trainer = createTrainer({
        id: trainerId,
        name: 'trainer name test',
    })
    const category = createCategory({
        id: categoryId,
        name: 'category name test',
    })
    const image = createImage({
        id: imageId,
        src: 'image source test',
    })
    const blog = createBlog({
        id: blogId,
        title: 'title test',
        body: 'body test',
        images: [imageId],
        tags: ['tag1', 'tag2'],
        category: categoryId,
        trainer: trainerId,
        date: date.current,
    })
    const categoryRepository = new CategoryRepositoryMock([category])
    const trainerRepository = new TrainerRepositoryMock([trainer])
    const imageRepository = new ImageRepositoryMock([image])
    const blogRepository = new BlogRepositoryMock([blog])
    const result: Result<GetBlogByIdResponse> = await new GetBlogByIdQuery(
        blogRepository,
        categoryRepository,
        trainerRepository,
        imageRepository,
    ).execute({
        id: blogId,
    })
    lookFor(result.unwrap()).toDeepEqual({
        id: blogId,
        title: blog.title.title,
        description: blog.body.body,
        category: category.name.name,
        tags: blog.tags.map((tag) => tag.tag),
        images: [image.src],
        trainer: {
            id: trainerId,
            name: trainer.name.name,
        },
        date: blog.date.date,
    })
}
