import { Comment } from '../../../../../../src/comment/domain/comment'
import { TargetType } from '../../../../../../src/comment/application/types/target-type'
import { CommentID } from '../../../../../../src/comment/domain/value-objects/comment.id'
import { Client } from '../../../../../../src/comment/domain/entities/client'
import { ClientID } from '../../../../../../src/comment/domain/value-objects/client.id'
import { ClientName } from '../../../../../../src/comment/domain/value-objects/client.name'
import { CommentContent } from '../../../../../../src/comment/domain/value-objects/comment.content'
import { CommentDate } from '../../../../../../src/comment/domain/value-objects/comment.date'
import { Target } from '../../../../../../src/comment/domain/value-objects/target'
import { BlogID } from '../../../../../../src/comment/domain/value-objects/blog.id'
import { LessonID } from '../../../../../../src/comment/domain/value-objects/lesson.id'

export const createComment = (data?: {
    id?: string
    targetId?: string
    targetType?: TargetType
    creationDate?: Date
    description?: string
    dislikes?: string[]
    likes?: string[]
    userId?: string
    userName?: string
}): Comment =>
    new Comment(
        new CommentID(data?.id ?? '2b41f747-563e-41ef-96fe-b4347d8326b8'),
        {
            client: new Client(
                new ClientID(
                    data?.userId ?? '9817f2b2-2ffc-418e-8083-e80746e7ec2f',
                ),
                {
                    name: new ClientName(
                        data?.userName ??
                            '206786bc-f11e-4f06-8a61-98f7771f18e5',
                    ),
                },
            ),
            content: new CommentContent(
                data?.description ?? 'test description',
            ),
            creationDate: new CommentDate(data?.creationDate ?? new Date()),
            whoLiked: data?.likes ? data.likes.map((l) => new ClientID(l)) : [],
            whoDisliked: data?.dislikes
                ? data.dislikes.map((l) => new ClientID(l))
                : [],
            target: data?.targetType
                ? data.targetType === 'BLOG'
                    ? Target.blog(
                          new BlogID(
                              data?.targetId ??
                                  'fbd070b8-a422-4ae5-8e09-c4d2985b0c17',
                          ),
                      )
                    : Target.lesson(
                          new LessonID(
                              data?.targetId ??
                                  'fbd070b8-a422-4ae5-8e09-c4d2985b0c17',
                          ),
                      )
                : Target.blog(
                      new BlogID(
                          data?.targetId ??
                              'fbd070b8-a422-4ae5-8e09-c4d2985b0c17',
                      ),
                  ),
        },
    )
