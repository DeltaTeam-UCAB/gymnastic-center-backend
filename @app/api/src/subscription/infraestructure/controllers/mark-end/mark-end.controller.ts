import { Body, HttpException, Post, UseGuards } from '@nestjs/common'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { PostgresTransactionProvider } from 'src/core/infraestructure/repositories/transaction/postgres.transaction'
import { CurrentUserResponse } from '../../auth/current/types/response'
import { User } from '../../decorators/user.decorator'
import { SubscriptionPostgresRepositoryTransactional } from '../../repositories/postgres/subscription.repository.transactional'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { TransactionHandlerDecorator } from 'src/core/application/decorators/transaction.handler.decorator'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UserGuard } from '../../guards/user.guard'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { MarkEndDTO } from './dto/dto'
import { UpdateSubscriptionCommand } from 'src/subscription/application/commands/update/update.command'
import { UpdateSubscriptionResponse } from 'src/subscription/application/commands/update/types/response'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'

@Controller({
    path: 'progress',
    docTitle: 'Subscription',
    bearerAuth: true,
})
export class MarkEndLessonController
    implements
        ControllerContract<
            [user: CurrentUserResponse, body: MarkEndDTO],
            UpdateSubscriptionResponse
        >
{
    constructor(
        private transactionProvider: PostgresTransactionProvider,
        private eventPublisher: RabbitMQEventHandler,
    ) {}
    @Post('mark/end')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @User() user: CurrentUserResponse,
        @Body() data: MarkEndDTO,
    ): Promise<UpdateSubscriptionResponse> {
        const transactionHandler = await this.transactionProvider.create()
        const resp = await new ErrorDecorator(
            new LoggerDecorator(
                new TransactionHandlerDecorator(
                    new DomainErrorParserDecorator(
                        new UpdateSubscriptionCommand(
                            new SubscriptionPostgresRepositoryTransactional(
                                transactionHandler.queryRunner,
                            ),
                            new ConcreteDateProvider(),
                            this.eventPublisher,
                        ),
                    ),
                    transactionHandler.transactionHandler,
                ),
                new NestLogger('Mark end subscription'),
            ),
            (error) => new HttpException(error.message, 404),
        ).execute({
            client: user.id,
            ...data,
            lesson: data.lessonId,
            course: data.courseId,
        })
        return resp.unwrap()
    }
}
