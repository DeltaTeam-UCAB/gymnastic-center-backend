import {
    Delete,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { DeleteBlogCommand } from 'src/blog/application/commands/delete/delete.blog.command'
import { DeleteBlogResponse } from 'src/blog/application/commands/delete/types/response'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { BlogPostgresRepository } from '../../repositories/postgres/blog.repository'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { BLOG_DOC_PREFIX, BLOG_ROUTE_PREFIX } from '../prefix'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'

@Controller({
    path: BLOG_ROUTE_PREFIX,
    docTitle: BLOG_DOC_PREFIX,
    bearerAuth: true,
})
export class DeleteBlogController
    implements ControllerContract<[id: string], DeleteBlogResponse>
{
    constructor(
        private blogRepository: BlogPostgresRepository,
        private eventHandler: RabbitMQEventHandler,
    ) {}

    @Delete('one/:id')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<DeleteBlogResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new DomainErrorParserDecorator(
                    new DeleteBlogCommand(
                        this.blogRepository,
                        this.eventHandler,
                    ),
                ),
                new NestLogger('Delete Blog'),
            ),
            (err) => new HttpException(err.message, 404),
        ).execute({
            id,
        })
        return result.unwrap()
    }
}
