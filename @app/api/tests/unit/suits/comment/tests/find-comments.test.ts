import { FindCommentsQuery } from '../../../../../src/comment/application/queries/find/find-comments.query'
import { createComment } from './utils/comment.factory'
import { CommentRepositoryMock } from './utils/comment.repository.mock'
import { DateProviderMock } from './utils/date.provider.mock'

export const name = 'Should find comments'

export const body = async () => {
    const dateProvider = new DateProviderMock()
    const comment = createComment({
        creationDate: dateProvider.current,
        id: '12345544',
        targetId: '12345',
        targetType: 'POST',
    })
    const commentRepository = new CommentRepositoryMock([comment])

    const result = await new FindCommentsQuery(commentRepository).execute({
        targetId: '12345',
        targetType: 'POST',
        userId: '1234567',
        perPage: 5,
        page: 0,
    })
    lookFor(result.unwrap()).toDeepEqual([
        {
            body: 'test description',
            countDislikes: 0,
            countLikes: 0,
            date: dateProvider.current,
            id: '12345544',
            user: '987654321',
            userDisliked: false,
            userLiked: false,
        },
    ])
}
