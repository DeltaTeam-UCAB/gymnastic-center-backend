import { TargetType } from '../../../../../src/comment/application/types/target-type'
import { createComment } from './utils/comment.factory'
import { CommentRepositoryMock } from './utils/comment.repository.mock'
import { DeleteCommentsByTargetCommand } from '../../../../../src/comment/application/commands/delete-by-target/delete.by.target'
import { eventPublisherStub } from './utils/event.publisher.stup'
import { Target } from '../../../../../src/comment/domain/value-objects/target'
import { LessonID } from '../../../../../src/comment/domain/value-objects/lesson.id'

export const name = 'Should delete comments by target'
export const body = async () => {
    const date = new Date()
    const userId = 'e71a83b0-da56-4fc7-b25f-48e92d51e6a4'
    const commentId = '4359eabd-0737-427c-bf2d-87ef228cdb7a'
    const targetId = 'c8538a6c-fdae-4160-b5a2-d14e65f765c4'
    const targetType: TargetType = 'LESSON'
    const commentRepo = new CommentRepositoryMock([
        createComment({
            id: commentId,
            targetId,
            userId,
            targetType,
            creationDate: date,
            dislikes: [userId],
        }),
        createComment({
            id: commentId,
            targetId,
            userId,
            targetType,
            creationDate: date,
            dislikes: [userId],
        }),
    ])
    const result = await new DeleteCommentsByTargetCommand(
        commentRepo,
        eventPublisherStub,
    ).execute({
        targetId,
        type: targetType,
    })
    lookFor(result.isError()).equals(false)
    lookFor(
        await commentRepo.getAllCommentsByTarget(
            Target.lesson(new LessonID(targetId)),
        ),
    ).toDeepEqual([])
}
