import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteBlogDTO } from './types/dto'
import { DeleteBlogResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogRepository } from '../../repositories/blog.repository'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { blogNotFoundError } from '../../errors/blog.not.found'

export class DeleteBlogCommand
    implements ApplicationService<DeleteBlogDTO, DeleteBlogResponse>
{
    constructor(
        private blogRepository: BlogRepository,
        private eventPublisher: EventPublisher,
    ) {}

    async execute(data: DeleteBlogDTO): Promise<Result<DeleteBlogResponse>> {
        const blog = await this.blogRepository.getById(new BlogId(data.id))
        if (!isNotNull(blog)) return Result.error(blogNotFoundError())
        blog.delete()
        const result = await this.blogRepository.delete(blog)
        if (result.isError()) return result.convertToOther()
        this.eventPublisher.publish(blog.pullEvents())
        return Result.success({ id: blog.id.id })
    }
}
