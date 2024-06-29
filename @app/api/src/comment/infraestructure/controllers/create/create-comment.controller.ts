import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { CreateCommentDTO } from './dto/create.comment.dto'
import { CreateCommentResponse } from 'src/comment/application/commands/create/types/response'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { Roles } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { CreateCommentCommand } from 'src/comment/application/commands/create/create-comment.command'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { CommentPostgresRepository } from '../../repositories/postgres/comment.repository'
import { BlogPostgresByCommentRepository } from '../../repositories/postgres/blog.repository'
import { LessonPostgresByCommentRepository } from '../../repositories/postgres/lesson.repository'
import { User as UserDecorator } from 'src/user/infraestructure/decorators/user.decorator'
import { CheckTargetExistence } from 'src/comment/application/decorators/check-target-existence.decorator'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { UserByCommentPostgresRepository } from '../../repositories/postgres/user.repository'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { AuditDecorator } from 'src/core/application/decorators/audit.decorator'
import { AuditingTxtRepository } from 'src/core/infraestructure/auditing/repositories/txt/auditing.repository'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'

@Controller({
    path: 'comment',
    docTitle: 'Comment',
    bearerAuth: true,
})
export class CreateController
implements
        ControllerContract<
            [body: CreateCommentDTO, user: CurrentUserResponse],
            CreateCommentResponse
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        private commentRepo: CommentPostgresRepository,
        private userRepo: UserByCommentPostgresRepository,
        private blogRepo: BlogPostgresByCommentRepository,
        private lessonRepo: LessonPostgresByCommentRepository,
        private eventHandler: RabbitMQEventHandler,
    ) {}

    @Post('release')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Body() body: CreateCommentDTO,
        @UserDecorator() user: CurrentUserResponse,
    ): Promise<CreateCommentResponse> {
        const audit = {
            user: user.id,
            operation: 'Create Comment',
            succes: true,
            ocurredOn: new Date(Date.now()),
            data: JSON.stringify(body),
        }

        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new AuditDecorator(
                    new CheckTargetExistence(
                        new CreateCommentCommand(
                            this.commentRepo,
                            this.userRepo,
                            new ConcreteDateProvider(),
                            this.idGen,
                            this.eventHandler,
                        ),
                        this.lessonRepo,
                        this.blogRepo,
                    ),
                    new AuditingTxtRepository(),
                    audit,
                ),
                new NestLogger('Create comment'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({
            targetId: body.target,
            targetType: body.targetType,
            description: body.body,
            userId: user.id,
        })
        return result.unwrap()
    }
}
