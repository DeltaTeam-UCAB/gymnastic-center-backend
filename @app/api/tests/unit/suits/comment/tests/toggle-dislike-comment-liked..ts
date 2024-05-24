import { ToggleDislikeCommand } from '../../../../../src/comment/application/commands/toggle-dislike/toggle-dislike.command'
import { ToggleDislikeDTO } from '../../../../../src/comment/application/commands/toggle-dislike/types/dto'
import { ToggleDislikeResponse } from '../../../../../src/comment/application/commands/toggle-dislike/types/response'
import { CheckCommentExistence } from '../../../../../src/comment/application/decorators/check-comment-existence.decorator'
import { TargetType } from '../../../../../src/comment/application/models/comment'
import { createComment } from './utils/comment.factory'
import { CommentRepositoryMock } from './utils/comment.repository.mock'

export const name = 'Should dislike liked comment'

export const body = async () => {
    const date = new Date()
    const userId = 'w12d13d31'
    const commentId = '1234556'
    const targetId = '283764287364'
    const targetType: TargetType = 'LESSON'
    const testComment = createComment({
        id: commentId,
        targetId,
        targetType,
        creationDate: date,
        likes: [userId],
    })
    const commentRepo = new CommentRepositoryMock([testComment])

    await new CheckCommentExistence<ToggleDislikeDTO, ToggleDislikeResponse>(
        new ToggleDislikeCommand(commentRepo),
        commentRepo,
    ).execute({
        commentId,
        userId,
    })
    lookFor(
        await commentRepo.getComments(targetId, targetType, 0, 1),
    ).toDeepEqual([
        {
            creationDate: date,
            description: 'test description',
            dislikes: [],
            id: commentId,
            likes: [],
            targetId: targetId,
            targetType: targetType,
            userId: '987654321',
        },
    ])
}
