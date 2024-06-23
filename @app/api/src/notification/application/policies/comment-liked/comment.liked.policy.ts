import { ApplicationService } from 'src/core/application/service/application.service'
import { CommentLikedPolicyDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CreateNotificationDTO } from '../../commands/create/types/dto'
import { CreateNotificationResponse } from '../../commands/create/types/response'
import { CommentRepository } from '../../repositories/comment.repository'
import { ClientRepository } from '../../repositories/client.repository'
import { commentNotFoundError } from '../../errors/comment.not.found'
import { clientNotExist } from '../../errors/client.not.exist'

export class CommentLikedPolicy
implements ApplicationService<CommentLikedPolicyDTO, void>
{
    constructor(
        private notificationService: ApplicationService<
            CreateNotificationDTO,
            CreateNotificationResponse
        >,
        private commentRepository: CommentRepository,
        private clientRepository: ClientRepository,
    ) {}
    async execute(data: CommentLikedPolicyDTO): Promise<Result<void>> {
        const comment = await this.commentRepository.getById(data.comment)
        if (!comment) return Result.error(commentNotFoundError())
        const client = await this.clientRepository.getById(data.client)
        if (!client) return Result.error(clientNotExist())
        const result = await this.notificationService.execute({
            client: comment.author,
            title: 'Comment liked!',
            body: `The user: ${client.name} liked your comment`,
        })
        if (result.isError()) return result.convertToOther()
        return Result.success(undefined)
    }
}
