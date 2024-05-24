import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { ToggleLikeResponse } from 'src/comment/application/commands/toggle-like/types/response'
import {
    HttpException,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
} from '@nestjs/common'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { User as UserDecorator } from 'src/user/infraestructure/decorators/user.decorator'
import { User } from 'src/user/application/models/user'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { CommentPostgresRepository } from '../../repositories/postgres/comment.repository'
import { ApiHeader } from '@nestjs/swagger'
import { ToggleDislikeCommand } from 'src/comment/application/commands/toggle-dislike/toggle-dislike.command'
import { ToggleDislikeResponse } from 'src/comment/application/commands/toggle-dislike/types/response'
import { CheckCommentExistence } from 'src/comment/application/decorators/check-comment-existence.decorator'

@Controller({
    path: 'comment',
    docTitle: 'Comment',
})
export class ToggleDislikeController
    implements
        ControllerContract<[param: string, user: User], ToggleDislikeResponse>
{
    constructor(private commentRepository: CommentPostgresRepository) {}

    @Post('toggle/dislike/:id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Param('id', ParseUUIDPipe) param: string,
        @UserDecorator() user: User,
    ): Promise<ToggleDislikeResponse> {
        const result = await new ErrorDecorator(
            new CheckCommentExistence(
                new ToggleDislikeCommand(this.commentRepository),
                this.commentRepository,
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({
            commentId: param,
            userId: user.id,
        })
        return result.unwrap()
    }
}
