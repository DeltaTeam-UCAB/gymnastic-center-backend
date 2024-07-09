import { DeleteBlogsByTrainerCommand } from '../../../../../src/blog/application/commands/delete-by-trainer/delete-by-trainer.blog.command'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { DateProviderMock } from '../../blog/tests/utils/date.provider.mock'
import { createBlog } from './utils/blog.factory'
import { eventPublisherStub } from './utils/event.publisher.stup'
import { TrainerId } from '../../../../../src/blog/domain/value-objects/trainer.id'

export const name = 'Should delete blogs by trainer'
export const body = async () => {
    const date = new DateProviderMock(new Date())
    const blog1Id = '84821c3f-0e66-4bf4-a3a8-520e42e50752'
    const blog2Id = '008904a1-80e3-48ff-9969-864dfb558e4d'
    const trainerId = 'b54c7768-ce9e-470e-b18e-b51fb10829a7'
    const blogRepository = new BlogRepositoryMock([
        createBlog({
            id: blog1Id,
            title: 'test blog 1',
            body: 'test made for blog body 1',
            images: [],
            tags: [],
            category: 'fb7f0cf1-8525-4bce-8f91-3bf235046927',
            trainer: trainerId,
            date: date.current,
        }),
        createBlog({
            id: blog2Id,
            title: 'test blog 2',
            body: 'test made for blog body 2',
            images: [],
            tags: [],
            category: 'a1713573-82f5-4244-8c58-55542d0ff8b5',
            trainer: trainerId,
            date: date.current,
        }),
    ])
    const result = await new DeleteBlogsByTrainerCommand(
        blogRepository,
        eventPublisherStub,
    ).execute({ id: trainerId })
    const possibleBlogs = await blogRepository.countByTrainer(
        new TrainerId(trainerId),
    )
    lookFor(result.isError()).equals(false)
    lookFor(possibleBlogs).equals(0)
}
