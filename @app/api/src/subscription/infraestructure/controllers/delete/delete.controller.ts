import {
    Delete,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { PostgresTransactionProvider } from 'src/core/infraestructure/repositories/transaction/postgres.transaction'
import { CreateSubscriptionResponse } from 'src/subscription/application/commands/create/types/response'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { User } from '../../decorators/user.decorator'
import { SubscriptionPostgresRepositoryTransactional } from '../../repositories/postgres/subscription.repository.transactional'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { TransactionHandlerDecorator } from 'src/core/application/decorators/transaction.handler.decorator'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UserGuard } from '../../guards/user.guard'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { DeleteSubscriptionCommand } from 'src/subscription/application/commands/delete/delete.subscription.command'

@Controller({
    path: 'progress',
    docTitle: 'Subscription',
    bearerAuth: true,
})
export class DeleteSubscriptionController
    implements
        ControllerContract<
            [user: CurrentUserResponse, course: string],
            CreateSubscriptionResponse
        >
{
    constructor(
        private transactionProvider: PostgresTransactionProvider,
        private eventPublisher: RabbitMQEventHandler,
    ) {}
    @Delete('one/:course')
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
                        new DeleteSubscriptionCommand(
                            new SubscriptionPostgresRepositoryTransactional(
                                transactionHandler.queryRunner,
                            ),
                            this.eventPublisher,
                        ),
                    ),
                    transactionHandler.transactionHandler,
                ),
                new NestLogger('Delete subscription'),
            ),
            (error) => new HttpException(error.message, 404),
        ).execute({
            course,
            client: user.id,
        })
        return resp.unwrap()
    }
}
