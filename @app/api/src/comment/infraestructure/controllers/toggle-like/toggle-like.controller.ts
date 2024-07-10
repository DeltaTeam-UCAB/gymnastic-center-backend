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
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { User as UserDecorator } from '../../decorators/user.decorator'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { ToggleLikeCommand } from 'src/comment/application/commands/toggle-like/toggle-like.command'
import { CommentPostgresRepository } from '../../repositories/postgres/comment.repository'
import { CheckCommentExistence } from 'src/comment/application/decorators/check-comment-existence.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'
import { CurrentUserResponse } from '../../auth/current/types/response'

@Controller({
    path: 'comment',
    docTitle: 'Comment',
    bearerAuth: true,
})
export class ToggleLikeController
implements
        ControllerContract<
            [param: string, user: CurrentUserResponse],
            ToggleLikeResponse
        >
{
    constructor(
        private commentRepository: CommentPostgresRepository,
        private eventHandler: RabbitMQEventHandler,
    ) {}

    @Post('toggle/like/:id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Param('id', ParseUUIDPipe) param: string,
        @UserDecorator() user: CurrentUserResponse,
    ): Promise<ToggleLikeResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new CheckCommentExistence(
                    new DomainErrorParserDecorator(
                        new ToggleLikeCommand(
                            this.commentRepository,
                            this.eventHandler,
                        ),
                    ),
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
