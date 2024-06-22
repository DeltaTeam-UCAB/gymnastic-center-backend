import { FindCommentsQuery } from '../../../../../src/comment/application/queries/find/find-comments.query'
import { TargetType } from '../../../../../src/comment/application/types/target-type'
import { createComment } from './utils/comment.factory'
import { CommentRepositoryMock } from './utils/comment.repository.mock'
import { DateProviderMock } from './utils/date.provider.mock'
import { createUser } from './utils/user.factory'

export const name = 'Should find comments'

export const body = async () => {
    const userId = 'e71a83b0-da56-4fc7-b25f-48e92d51e6a4'
    const user = createUser({
        id: userId,
    })
    const dateProvider = new DateProviderMock()
    const commentId = '4359eabd-0737-427c-bf2d-87ef228cdb7a'
    const targetId = 'c8538a6c-fdae-4160-b5a2-d14e65f765c4'
    const targetType: TargetType = 'BLOG'
    const comment = createComment({
        creationDate: dateProvider.current,
        id: commentId,
        targetId,
        targetType,
        userId: user.id.id,
        userName: user.name.name,
    })
    const commentRepository = new CommentRepositoryMock([comment])
    const result = await new FindCommentsQuery(commentRepository).execute({
        targetId,
        targetType,
        userId,
        perPage: 5,
        page: 1,
    })
    lookFor(result.unwrap()).toDeepEqual([
        {
            body: comment.content.content,
            countDislikes: 0,
            countLikes: 0,
            date: dateProvider.current,
            id: commentId,
            user: comment.client.name.name,
            userDisliked: false,
            userLiked: false,
        },
    ])
}
