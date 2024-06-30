import { TargetType } from '../../../../../src/comment/application/types/target-type'
import { createComment } from './utils/comment.factory'
import { CommentRepositoryMock } from './utils/comment.repository.mock'
import { DeleteCommentCommand } from '../../../../../src/comment/application/commands/delete/delete.comment.command'
import { eventPublisherStub } from './utils/event.publisher.stup'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { DeleteCommentResponse } from '../../../../../src/comment/application/commands/delete/types/response'
import { CLIENT_NOT_AUTHOR } from '../../../../../src/comment/application/errors/client.not.author'

export const name = 'Should not delete a comment, client not the author'
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
        dislikes: [userId],
    })
    const commentRepo = new CommentRepositoryMock([testComment])
    const result: Result<DeleteCommentResponse> =
        await new DeleteCommentCommand(commentRepo, eventPublisherStub).execute(
            {
                id: testComment.id.id,
                client: userId,
            },
        )
    lookFor(result.isError()).equals(true)
    result.handleError((e) => {
        lookFor(e.name).equals(CLIENT_NOT_AUTHOR)
    })
}
