import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteBlogsByTrainerDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogRepository } from '../../repositories/blog.repository'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'

export class DeleteBlogsByTrainerCommand
    implements ApplicationService<DeleteBlogsByTrainerDTO, void>
{
    constructor(
        private blogRepository: BlogRepository,
        private eventPublisher: EventPublisher,
    ) {}

    async execute(data: DeleteBlogsByTrainerDTO): Promise<Result<void>> {
        const blogs = await this.blogRepository.getAllByTrainer(
            new TrainerId(data.id),
        )
        await blogs.asyncForEach(async (b) => {
            b.delete()
            await this.blogRepository.delete(b)
            this.eventPublisher.publish(b.pullEvents())
        })
        return Result.success(undefined)
    }
}
