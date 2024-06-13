import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { BLOG_ROUTE_PREFIX, BLOG_DOC_PREFIX } from '../prefix'
import { CreateBlogDTO } from './dto/create.blog.dto'
import { CreateBlogResponse } from '../../../../../src/blog/application/commands/create/types/response'
import { CreateBlogCommand } from 'src/blog/application/commands/create/create.blog.command'
import { TrainerByBlogPostgresRepository } from '../../repositories/postgres/trainer.repository'
import { BlogTitleNotExistDecorator } from 'src/blog/application/commands/create/decorators/title.exist.decorator'
import { TrainerExistDecorator } from 'src/blog/application/commands/create/decorators/trainer.exist.decorator'
import { CategoryByBlogPostgresRepository } from '../../repositories/postgres/category.repository'
import { CategoryExistDecorator } from 'src/blog/application/commands/create/decorators/category.exist.decorator'
import { TransactionHandlerDecorator } from 'src/core/application/decorators/transaction.handler.decorator'
import { PostgresTransactionProvider } from 'src/core/infraestructure/repositories/transaction/postgres.transaction'
import { BlogPostgresTransactionalRepository } from '../../repositories/postgres/blog.repository.transactional'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'

@Controller({
    path: BLOG_ROUTE_PREFIX,
    docTitle: BLOG_DOC_PREFIX,
})
export class CreateBlogController
    implements ControllerContract<[body: CreateBlogDTO], { id: string }>
{
    constructor(
        @Inject(UUID_GEN_NATIVE)
        private idGen: IDGenerator<string>,

        private trainerRepository: TrainerByBlogPostgresRepository,

        private categoryRepository: CategoryByBlogPostgresRepository,

        private transactionProvider: PostgresTransactionProvider,
    ) {}

    @Post('create')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(@Body() body: CreateBlogDTO): Promise<CreateBlogResponse> {
        const manager = await this.transactionProvider.create()
        const blogRepository = new BlogPostgresTransactionalRepository(
            manager.queryRunner,
        )
        const nestLogger = new NestLogger('Create Blog logger')

        const commandWithTitleValidator = new BlogTitleNotExistDecorator(
            new CreateBlogCommand(this.idGen, blogRepository),
            blogRepository,
        )
        const commandWithTrainerValidator = new TrainerExistDecorator(
            commandWithTitleValidator,
            this.trainerRepository,
        )
        const commandWithCategoryValidator = new CategoryExistDecorator(
            commandWithTrainerValidator,
            this.categoryRepository,
        )
        const result = await new ErrorDecorator(
            new TransactionHandlerDecorator(
                new LoggerDecorator(commandWithCategoryValidator, nestLogger),
                manager.transactionHandler,
            ),
            (e) => new HttpException(e.message, 400),
        ).execute(body)
        return result.unwrap()
    }
}
