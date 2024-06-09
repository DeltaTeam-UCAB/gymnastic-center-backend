import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { CreateCommentDTO } from './dto/create.comment.dto'
import { CreateCommentResponse } from 'src/comment/application/commands/create/types/response'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
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
import { User } from 'src/user/application/models/user'
import { CheckTargetExistence } from 'src/comment/application/decorators/check-target-existence.decorator'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'

@Controller({
    path: 'comment',
    docTitle: 'Comment',
})
export class CreateController
implements
        ControllerContract<
            [body: CreateCommentDTO, user: User],
            CreateCommentResponse
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        private commentRepo: CommentPostgresRepository,
        private blogRepo: BlogPostgresByCommentRepository,
        private lessonRepo: LessonPostgresByCommentRepository,
    ) {}

    @Post('release')
    @ApiHeader({
        name: 'auth',
    })
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Body() body: CreateCommentDTO,
        @UserDecorator() user: User,
    ): Promise<CreateCommentResponse> {
        const result = await new ErrorDecorator(
            new CheckTargetExistence(
                new CreateCommentCommand(
                    this.commentRepo,
                    new ConcreteDateProvider(),
                    this.idGen,
                ),
                this.lessonRepo,
                this.blogRepo,
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
