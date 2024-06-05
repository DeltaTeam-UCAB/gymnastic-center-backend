import { FindCommentsResponse } from 'src/comment/application/queries/find/types/response'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { FindCommentsDTO } from './dto/find.comments.dto'
import { Get, HttpException, Query, UseGuards } from '@nestjs/common'
import { FindCommentsQuery } from 'src/comment/application/queries/find/find-comments.query'
import { CommentPostgresRepository } from '../../repositories/postgres/comment.repository'
import { User } from 'src/user/application/models/user'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { User as UserDecorator } from 'src/user/infraestructure/decorators/user.decorator'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { ApiHeader } from '@nestjs/swagger'
import { Optional } from '@mono/types-utils'

@Controller({
    path: 'comment',
    docTitle: 'Comment',
})
export class FindCommentsController
    implements
        ControllerContract<
            [query: FindCommentsDTO, user: User],
            FindCommentsResponse[]
        >
{
    constructor(private commentRepo: CommentPostgresRepository) {}

    @Get('many')
    @UseGuards(UserGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Query() query: FindCommentsDTO,
        @UserDecorator() user: User,
    ): Promise<FindCommentsResponse[]> {
        if (!isNotNull(query.blog) && !isNotNull(query.lesson)) {
            new HttpException('Blog and Lesson ID are null', 400)
        }

        let targetType: 'BLOG' | 'LESSON'
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
