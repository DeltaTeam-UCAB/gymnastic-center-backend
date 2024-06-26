import { CreateCommentCommand } from '../../../../../src/comment/application/commands/create/create-comment.command'
import { CreateCommentResponse } from '../../../../../src/comment/application/commands/create/types/response'
import { CheckTargetExistence } from '../../../../../src/comment/application/decorators/check-target-existence.decorator'
import { LESSON_NOT_FOUND } from '../../../../../src/comment/application/errors/lesson.not.found'
import { TargetType } from '../../../../../src/comment/application/models/comment'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { CommentRepositoryMock } from './utils/comment.repository.mock'
import { DateProviderMock } from './utils/date.provider.mock'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { LessonRepositoryMock } from './utils/lesson.repository.mock'
import { BlogRepositoryMock } from './utils/blog.repository.mock'

export const name = 'Should not create a comment with an unvalid lesson ID'

export const body = async () => {
    const commentId = '234567'
    const targetType: TargetType = 'LESSON'
    const lessonId = '123456789'
    const userId = 'asdyt1312'
    const data = {
        description: 'test description',
        targetId: lessonId,
        targetType,
        userId,
    }
    const dateProvider = new DateProviderMock()
    const commentRepo = new CommentRepositoryMock()
    const lessonRepo = new LessonRepositoryMock()
    const postRepo = new BlogRepositoryMock()
    const result: Result<CreateCommentResponse> =
        await new CheckTargetExistence(
            new CreateCommentCommand(
                commentRepo,
                dateProvider,
                new IDGeneratorMock(commentId),
            ),
            lessonRepo,
            postRepo,
        ).execute(data)
    lookFor(
        result.handleError((e) => {
            lookFor(e.name).equals(LESSON_NOT_FOUND)
        }),
    )
}
