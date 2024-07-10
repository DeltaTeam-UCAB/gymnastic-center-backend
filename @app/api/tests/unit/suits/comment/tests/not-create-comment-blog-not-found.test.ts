import { CreateCommentCommand } from '../../../../../src/comment/application/commands/create/create-comment.command'
import { CreateCommentResponse } from '../../../../../src/comment/application/commands/create/types/response'
import { CheckTargetExistence } from '../../../../../src/comment/application/decorators/check-target-existence.decorator'
import { BLOG_NOT_FOUND } from '../../../../../src/comment/application/errors/blog.not.found'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { CommentRepositoryMock } from './utils/comment.repository.mock'
import { DateProviderMock } from './utils/date.provider.mock'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { LessonRepositoryMock } from './utils/lesson.repository.mock'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { TargetType } from '../../../../../src/comment/application/types/target-type'
import { createUser } from './utils/user.factory'
import { UserRepositoryMock } from './utils/user.repository.mock'
import { eventPublisherStub } from './utils/event.publisher.stup'

export const name = 'Should not create a comment with an unvalid blog ID'

export const body = async () => {
    const commentId = '4359eabd-0737-427c-bf2d-87ef228cdb7a'
    const targetType: TargetType = 'BLOG'
    const lessonId = 'c8538a6c-fdae-4160-b5a2-d14e65f765c4'
    const userId = 'e71a83b0-da56-4fc7-b25f-48e92d51e6a4'
    const client = createUser({ id: userId })
    const data = {
        description: 'test description',
        targetId: lessonId,
        targetType,
        userId,
    }
    const dateProvider = new DateProviderMock()
    const commentRepo = new CommentRepositoryMock()
    const userRepo = new UserRepositoryMock([client])
    const lessonRepo = new LessonRepositoryMock()
    const postRepo = new BlogRepositoryMock()
    const result: Result<CreateCommentResponse> =
        await new CheckTargetExistence(
            new CreateCommentCommand(
                commentRepo,
                userRepo,
                dateProvider,
                new IDGeneratorMock(commentId),
                eventPublisherStub,
            ),
            lessonRepo,
            postRepo,
        ).execute(data)
    lookFor(
        result.handleError((e) => {
            lookFor(e.name).equals(BLOG_NOT_FOUND)
        }),
    )
}
