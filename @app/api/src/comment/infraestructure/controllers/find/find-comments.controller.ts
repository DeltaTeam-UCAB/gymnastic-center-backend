import { FindCommentsResponse } from 'src/comment/application/queries/find/types/response'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { FindCommentsDTO } from './dto/find.comments.dto'
import { Get, HttpException, Query, UseGuards } from '@nestjs/common'
import { FindCommentsQuery } from 'src/comment/application/queries/find/find-comments.query'
import { CommentPostgresRepository } from '../../repositories/postgres/comment.repository'
import { UserGuard } from '../../guards/user.guard'
import { User as UserDecorator } from '../../decorators/user.decorator'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { Optional } from '@mono/types-utils'
import { TargetType } from 'src/comment/application/types/target-type'
import { CurrentUserResponse } from '../../auth/current/types/response'

@Controller({
    path: 'comment',
    docTitle: 'Comment',
    bearerAuth: true,
})
export class FindCommentsController
implements
        ControllerContract<
            [query: FindCommentsDTO, user: CurrentUserResponse],
            FindCommentsResponse[]
        >
{
    constructor(private commentRepo: CommentPostgresRepository) {}

    @Get('many')
    @UseGuards(UserGuard)
    async execute(
        @Query() query: FindCommentsDTO,
        @UserDecorator() user: CurrentUserResponse,
    ): Promise<FindCommentsResponse[]> {
        if (!isNotNull(query.blog) && !isNotNull(query.lesson)) {
            throw new HttpException('Blog and Lesson ID are null', 400)
        }

        let targetType: TargetType
        let targetId: Optional<string>

        if (isNotNull(query.blog)) {
            targetType = 'BLOG'
            targetId = query.blog
        } else {
            targetType = 'LESSON'
            targetId = query.lesson
        }

        const result = await new ErrorDecorator(
            new FindCommentsQuery(this.commentRepo),
            (e) => new HttpException(e.message, 400),
        ).execute({
            page: query.page,
            perPage: query.perPage,
            targetType: targetType,
            targetId: targetId!,
            userId: user.id,
        })
        return result.unwrap()
    }
}
