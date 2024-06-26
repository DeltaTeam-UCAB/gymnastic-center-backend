import { FindCommentsQuery } from '../../../../../src/comment/application/queries/find/find-comments.query'
import { createComment } from './utils/comment.factory'
import { CommentRepositoryMock } from './utils/comment.repository.mock'
import { DateProviderMock } from './utils/date.provider.mock'
import { createUser } from './utils/user.factory'
import { UserRepositoryMock } from './utils/user.repository.mock'

export const name = 'Should find comments'

export const body = async () => {
    const userId = '12132332'
    const user = createUser({
        id: userId,
    })
    const userRepository = new UserRepositoryMock([user])
    const dateProvider = new DateProviderMock()
    const comment = createComment({
        creationDate: dateProvider.current,
        id: '12345544',
        targetId: '12345',
        targetType: 'BLOG',
        userId: user.id,
    })
    const commentRepository = new CommentRepositoryMock([comment])

    const result = await new FindCommentsQuery(
        commentRepository,
        userRepository,
    ).execute({
        targetId: '12345',
        targetType: 'BLOG',
        userId: userId,
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
            user: user.name,
            userDisliked: false,
            userLiked: false,
        },
    ])
}
