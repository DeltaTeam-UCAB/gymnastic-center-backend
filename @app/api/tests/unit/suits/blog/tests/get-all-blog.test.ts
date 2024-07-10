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
import { DateProviderMock } from '../../blog/tests/utils/date.provider.mock'
import { GetAllBlogsDTO } from '../../../../../src/blog/application/queries/getAll/types/dto'

export const name = 'Should get all blogs'
export const body = async () => {
    const date = new DateProviderMock(new Date())
    const dataBlogs = {
        perPage: 5,
        page: 0,
        filter: 'RECENT',
    } satisfies GetAllBlogsDTO
    const blogId = '84821c3f-0e66-4bf4-a3a8-520e42e50752'
    const trainerId = '84821c3f-0e84-4bf4-a3a8-520e42e54121'
    const categoryId = '84821c3f-0e66-4bf4-a3a8-520e42e54125'
    const imageId = '84821c3f-0e66-4bf4-a3a8-520e42e54147'
    const trainer = createTrainer({
        id: trainerId,
        name: 'name test trainer',
    })
    const category = createCategory({
        id: categoryId,
        name: 'category name',
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
    const result: Result<GetAllBlogResponse[]> = await new GetAllBlogQuery(
        blogRepository,
        categoryRepository,
        trainerRepository,
        imageRepository,
    ).execute(dataBlogs)

    lookFor(result.unwrap()).toDeepEqual([
        {
            id: blogId,
            title: blog.title.title,
            description: blog.body.body,
            category: category.name.name,
            tags: blog.tags.map((tag) => tag.tag),
            image: image.src,
            trainer: trainer.name.name,
            date: blog.date.date,
        },
    ])
}
