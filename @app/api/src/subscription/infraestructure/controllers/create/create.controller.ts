import {
    HttpException,
    Inject,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
} from '@nestjs/common'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { PostgresTransactionProvider } from 'src/core/infraestructure/repositories/transaction/postgres.transaction'
import { CreateSubscriptionCommand } from 'src/subscription/application/commands/create/create.subscription'
import { CreateSubscriptionResponse } from 'src/subscription/application/commands/create/types/response'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { User } from 'src/user/infraestructure/decorators/user.decorator'
import { SubscriptionPostgresRepositoryTransactional } from '../../repositories/postgres/subscription.repository.transactional'
import { CoursePostgresBySubscriptionRepository } from '../../repositories/postgres/course.repository'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { TransactionHandlerDecorator } from 'src/core/application/decorators/transaction.handler.decorator'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'

@Controller({
    path: 'progress',
    docTitle: 'Subscription',
})
export class CreateSubscriptionController
    implements
        ControllerContract<
            [user: CurrentUserResponse, course: string],
            CreateSubscriptionResponse
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGenerator: IDGenerator<string>,
        private courseRepository: CoursePostgresBySubscriptionRepository,
        private transactionProvider: PostgresTransactionProvider,
    ) {}
    @Post('create/:course')
    @ApiHeader({
        name: 'auth',
    })
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @User() user: CurrentUserResponse,
        @Param('course', ParseUUIDPipe) course: string,
    ): Promise<CreateSubscriptionResponse> {
        const transactionHandler = await this.transactionProvider.create()
        const resp = await new ErrorDecorator(
            new LoggerDecorator(
                new TransactionHandlerDecorator(
                    new DomainErrorParserDecorator(
                        new CreateSubscriptionCommand(
                            this.idGenerator,
                            new SubscriptionPostgresRepositoryTransactional(
                                transactionHandler.queryRunner,
                            ),
                            this.courseRepository,
                            new ConcreteDateProvider(),
                        ),
                    ),
                    transactionHandler.transactionHandler,
                ),
                new NestLogger('Create subscription'),
            ),
            (error) => new HttpException(error.message, 404),
        ).execute({
            course,
            client: user.id,
        })
        return resp.unwrap()
    }
}
