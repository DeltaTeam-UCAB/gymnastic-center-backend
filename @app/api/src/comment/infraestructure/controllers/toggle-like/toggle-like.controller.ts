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
import { ToggleLikeCommand } from 'src/comment/application/commands/toggle-like/toggle-like.command'
import { CommentPostgresRepository } from '../../repositories/postgres/comment.repository'
import { ApiHeader } from '@nestjs/swagger'
import { CheckCommentExistence } from 'src/comment/application/decorators/check-comment-existence.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'

@Controller({
    path: 'comment',
    docTitle: 'Comment',
})
export class ToggleLikeController
implements
        ControllerContract<[param: string, user: User], ToggleLikeResponse>
{
    constructor(private commentRepository: CommentPostgresRepository) {}

    @Post('toggle/like/:id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Param('id', ParseUUIDPipe) param: string,
        @UserDecorator() user: User,
    ): Promise<ToggleLikeResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new CheckCommentExistence(
                    new ToggleLikeCommand(this.commentRepository),
                    this.commentRepository,
                ),
                new NestLogger('Toggle like'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({
            commentId: param,
            userId: user.id,
        })
        return result.unwrap()
    }
}
