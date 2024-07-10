import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { CurrentUserResponse } from '../../auth/current/types/response'
import { SubscriptionPostgresRepository } from '../../repositories/postgres/subscription.repository'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { Get, HttpException, UseGuards } from '@nestjs/common'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { UserGuard } from '../../guards/user.guard'
import { User } from '../../decorators/user.decorator'
import { CountSubscriptionsByClientResponse } from 'src/subscription/application/queries/count-by-client/types/response'
import { CountSubscriptionsByClientQuery } from 'src/subscription/application/queries/count-by-client/count.client.query'

@Controller({
    path: 'progress',
    docTitle: 'Subscription',
    bearerAuth: true,
})
export class CountSubscriptionsByClientController
implements
        ControllerContract<
            [user: CurrentUserResponse],
            CountSubscriptionsByClientResponse
        >
{
    constructor(
        private subscriptionRepository: SubscriptionPostgresRepository,
    ) {}

    @Get('count/client')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @User() user: CurrentUserResponse,
    ): Promise<CountSubscriptionsByClientResponse> {
        const resp = await new ErrorDecorator(
            new LoggerDecorator(
                new CountSubscriptionsByClientQuery(
                    this.subscriptionRepository,
                ),
                new NestLogger('Subscription count by client'),
            ),
            (e) => new HttpException(e.message, 404),
        ).execute({
            client: user.id,
        })
        return resp.unwrap()
    }
}
