import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCommentDTO } from './types/dto'
import { CreateCommentResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { DateProvider } from 'src/core/application/date/date.provider'
import { Comment } from 'src/comment/domain/comment'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'
import { UserRepository } from '../../repositories/user.repository'
import { ClientID } from 'src/comment/domain/value-objects/client.id'
import { CommentContent } from 'src/comment/domain/value-objects/comment.content'
import { CommentDate } from 'src/comment/domain/value-objects/comment.date'
import { Target } from 'src/comment/domain/value-objects/target'
import { BlogID } from 'src/comment/domain/value-objects/blog.id'
import { LessonID } from 'src/comment/domain/value-objects/lesson.id'
import { userNotFoundError } from '../../errors/user.not.found'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'

export class CreateCommentCommand
implements ApplicationService<CreateCommentDTO, CreateCommentResponse>
{
    constructor(
        private commentRepository: CommentRepository,
        private userRepository: UserRepository,
        private dateProvider: DateProvider,
        private idGen: IDGenerator<string>,
        private eventPublisher: EventPublisher,
    ) {}

    async execute(
        data: CreateCommentDTO,
    ): Promise<Result<CreateCommentResponse>> {
        const possibleClient = await this.userRepository.getById(
            new ClientID(data.userId),
        )
        if (!possibleClient) {
            return Result.error(userNotFoundError())
        }
        const commentId = this.idGen.generate()
        const comment = new Comment(new CommentID(commentId), {
            client: possibleClient,
            content: new CommentContent(data.description),
            creationDate: new CommentDate(this.dateProvider.current),
            target:
                data.targetType === 'BLOG'
                    ? Target.blog(new BlogID(data.targetId))
                    : Target.lesson(new LessonID(data.targetId)),
            whoDisliked: [],
            whoLiked: [],
        })
        await this.commentRepository.save(comment)
        this.eventPublisher.publish(comment.pullEvents())
        return Result.success({ commentId })
    }
}
