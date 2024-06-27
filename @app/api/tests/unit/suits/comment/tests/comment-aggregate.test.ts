import { Comment } from '../../../../../src/comment/domain/comment'
import { Client } from '../../../../../src/comment/domain/entities/client'
import { BlogID } from '../../../../../src/comment/domain/value-objects/blog.id'
import { ClientID } from '../../../../../src/comment/domain/value-objects/client.id'
import { ClientName } from '../../../../../src/comment/domain/value-objects/client.name'
import { CommentContent } from '../../../../../src/comment/domain/value-objects/comment.content'
import { CommentDate } from '../../../../../src/comment/domain/value-objects/comment.date'
import { CommentID } from '../../../../../src/comment/domain/value-objects/comment.id'
import { Target } from '../../../../../src/comment/domain/value-objects/target'

export const name = 'Should create a comment aggregate'

export const body = () => {
    const comment = new Comment(
        new CommentID('4b70fe02-7239-40b1-b839-f5d2eb61a078'),
        {
            client: new Client(
                new ClientID('80e6a602-4e50-4c6e-82bc-2c4633f313fc'),
                { name: new ClientName('client test name') },
            ),
            content: new CommentContent('comment test'),
            whoLiked: [],
            whoDisliked: [],
            target: Target.blog(
                new BlogID('875c3082-75e7-4503-acc7-3d73d3d7c7c9'),
            ),
            creationDate: new CommentDate(new Date()),
        },
    )
    lookFor(comment).toBeDefined()
}
