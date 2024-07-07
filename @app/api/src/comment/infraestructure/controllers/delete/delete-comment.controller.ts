import { DeleteCommentResponse } from 'src/comment/application/commands/delete/types/response'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { CommentPostgresRepository } from '../../repositories/postgres/comment.repository'
import {
    Delete,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { User } from 'src/user/infraestructure/decorators/user.decorator'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { DeleteCommentCommand } from 'src/comment/application/commands/delete/delete.comment.command'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'

@Controller({
    path: 'comment',
    docTitle: 'Comment',
    bearerAuth: true,
})
export class DeleteCommentController
    implements
        ControllerContract<
            [id: string, user: CurrentUserResponse],
            DeleteCommentResponse
        >
{
    constructor(
        private commentRepo: CommentPostgresRepository,
        private eventHandler: RabbitMQEventHandler,
    ) {}
    @Delete('one/:id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
        @User() user: CurrentUserResponse,
    ): Promise<DeleteCommentResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new DomainErrorParserDecorator(
                    new DeleteCommentCommand(
                        this.commentRepo,
                        this.eventHandler,
                    ),
                ),
                new NestLogger('Delete Comment'),
            ),
            (err) => new HttpException(err.message, 404),
        ).execute({
            id,
            client: user.id,
        })
        return result.unwrap()
    }
}
