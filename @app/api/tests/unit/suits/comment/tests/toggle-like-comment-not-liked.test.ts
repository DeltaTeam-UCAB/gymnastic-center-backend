import { ToggleLikeCommand } from '../../../../../src/comment/application/commands/toggle-like/toggle-like.command'
import { ToggleLikeDTO } from '../../../../../src/comment/application/commands/toggle-like/types/dto'
import { ToggleLikeResponse } from '../../../../../src/comment/application/commands/toggle-like/types/response'
import { CheckCommentExistence } from '../../../../../src/comment/application/decorators/check-comment-existence.decorator'
import { TargetType } from '../../../../../src/comment/application/types/target-type'
import { ClientID } from '../../../../../src/comment/domain/value-objects/client.id'
import { CommentID } from '../../../../../src/comment/domain/value-objects/comment.id'
import { createComment } from './utils/comment.factory'
import { CommentRepositoryMock } from './utils/comment.repository.mock'

export const name = 'Should like not liked comment'

export const body = async () => {
    const date = new Date()
    const userId = 'e71a83b0-da56-4fc7-b25f-48e92d51e6a4'
    const commentId = '4359eabd-0737-427c-bf2d-87ef228cdb7a'
    const targetId = 'c8538a6c-fdae-4160-b5a2-d14e65f765c4'
    const targetType: TargetType = 'LESSON'
    const testComment = createComment({
        id: commentId,
        targetId,
        targetType,
        creationDate: date,
        likes: [],
    })
    const commentRepo = new CommentRepositoryMock([testComment])

    await new CheckCommentExistence<ToggleLikeDTO, ToggleLikeResponse>(
        new ToggleLikeCommand(commentRepo),
        commentRepo,
    ).execute({
        commentId,
        userId,
    })
    const comment = await commentRepo.getCommentById(new CommentID(commentId))
    const clientIdVO = new ClientID(userId)
    lookFor(comment).toBeDefined()
    lookFor(comment?.clientLiked(clientIdVO)).equals(true)
}
