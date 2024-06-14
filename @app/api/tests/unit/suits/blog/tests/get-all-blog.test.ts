import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { createBlog } from './utils/blog.factory'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { CategoryRepositoryMock } from './utils/category.repository.mock'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { ImageRepositoryMock } from './utils/image.repository.mock'
import { GetAllBlogResponse } from '../../../../../src/blog/application/queries/getAll/types/response'
import { GetAllBlogQuery } from '../../../../../src/blog/application/queries/getAll/getAll.blog.query'
import { createTrainer } from './utils/trainer.factory'
import { createCategory } from './utils/category.factory'
import { createImage } from './utils/image.factory'

export const name = 'Should get all blogs'
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
    const result: Result<GetAllBlogResponse[]> = await new GetAllBlogQuery(
        blogRepository,
        categoryRepository,
        trainerRepository,
        imageRepository,
    ).execute({
        filter: 'RECENT',
        page: 0,
        perPage: 5,
    })
    lookFor(result.unwrap()).toDeepEqual([
        {
            id: blog.id,
            title: blog.title,
            description: blog.body,
            category: category.name,
            tags: blog.tags,
            images: [image.src],
            trainer: trainer.name,
            date: blog.date,
        },
    ])
}
