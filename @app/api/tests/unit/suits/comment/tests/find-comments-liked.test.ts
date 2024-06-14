import { FindCommentsQuery } from '../../../../../src/comment/application/queries/find/find-comments.query'
import { createComment } from './utils/comment.factory'
import { CommentRepositoryMock } from './utils/comment.repository.mock'
import { DateProviderMock } from './utils/date.provider.mock'
import { createUser } from './utils/user.factory'
import { UserRepositoryMock } from './utils/user.repository.mock'

export const name = 'Should find comments with user like'

export const body = async () => {
    const userId = '12132332'
    const user = createUser({
        id: userId,
    })
    const user2 = createUser({
        name: 'user2',
    })
    const userRepository = new UserRepositoryMock([user, user2])
    const dateProvider = new DateProviderMock()
    const comment = createComment({
        creationDate: dateProvider.current,
        id: '12345544',
        targetId: '12345',
        targetType: 'BLOG',
        likes: [userId],
        userId: user2.id,
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
            countLikes: 1,
            date: dateProvider.current,
            id: '12345544',
            user: user2.name,
            userDisliked: false,
            userLiked: true,
        },
    ])
}
