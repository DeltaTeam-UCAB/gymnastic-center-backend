import { CreateCommentCommand } from '../../../../../src/comment/application/commands/create/create-comment.command'
import { CommentRepositoryMock } from './utils/comment.repository.mock'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { CheckTargetExistence } from '../../../../../src/comment/application/decorators/check-target-existence.decorator'
import { LessonRepositoryMock } from './utils/lesson.repository.mock'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { TargetType } from '../../../../../src/comment/application/models/comment'
import { DateProviderMock } from './utils/date.provider.mock'
export const name = 'Should create comment (post target) with valid data'

export const body = async () => {
    const commentId = '234567'
    const targetType: TargetType = 'BLOG'
    const postId = '123456789'
    const userId = 'asdyt1312'
    const data = {
        description: 'test description',
        targetId: postId,
        targetType,
        userId,
    }
    const dateProvider = new DateProviderMock()
    const commentRepo = new CommentRepositoryMock()
    const lessonRepo = new LessonRepositoryMock()
    const postRepo = new BlogRepositoryMock([postId])
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
        await commentRepo.getComments(postId, targetType, 0, 1),
    ).toDeepEqual([
        {
            id: commentId,
            targetId: postId,
            targetType,
            userId,
            description: 'test description',
            likes: [],
            dislikes: [],
            creationDate: dateProvider.current,
        },
    ])
}
