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
import { CurrentUserResponse } from '../../auth/current/types/response'
import { User } from '../../decorators/user.decorator'
import { SubscriptionPostgresRepositoryTransactional } from '../../repositories/postgres/subscription.repository.transactional'
import { CoursePostgresBySubscriptionRepository } from '../../repositories/postgres/course.repository'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { TransactionHandlerDecorator } from 'src/core/application/decorators/transaction.handler.decorator'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UserGuard } from '../../guards/user.guard'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'

@Controller({
    path: 'progress',
    docTitle: 'Subscription',
    bearerAuth: true,
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
        private eventPublisher: RabbitMQEventHandler,
    ) {}
    @Post('start/:course')
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
                            this.eventPublisher,
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
