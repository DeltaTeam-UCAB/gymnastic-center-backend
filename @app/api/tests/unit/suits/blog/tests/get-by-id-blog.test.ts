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

export const name = 'Should get blog by ID'
export const body = async () => {
    const trainer = createTrainer()
    const category = createCategory()
    const image = createImage()
    const blog = createBlog({
        category: category.id,
        trainer: trainer.id,
        images: [image.id],
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
        id: blog.id,
    })
    lookFor(result.unwrap()).toDeepEqual({
        id: blog.id,
        title: blog.title,
        description: blog.body,
        category: category.name,
        tags: blog.tags,
        images: [image.src],
        trainer: trainer,
        date: blog.date,
    })
}
