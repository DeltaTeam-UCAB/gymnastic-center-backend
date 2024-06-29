import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { Get, HttpException, UseGuards } from '@nestjs/common'
import { User } from 'src/user/infraestructure/decorators/user.decorator'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { GetCountNotificationsNotReadedResponse } from 'src/notification/application/queries/not-readed/types/response'
import { GetCountNotificationsNotReadedQuery } from 'src/notification/application/queries/not-readed/notifications.not.readed.query'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'

@Controller({
    path: 'notifications',
    docTitle: 'Notification',
    bearerAuth: true,
})
export class CountNotificationsNotReadedController
implements
        ControllerContract<
            [user: CurrentUserResponse],
            GetCountNotificationsNotReadedResponse
        >
{
    constructor(
        private notificationRepository: NotificationPostgresRepository,
    ) {}
    @Get('count/not-readed')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @User() user: CurrentUserResponse,
    ): Promise<GetCountNotificationsNotReadedResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new GetCountNotificationsNotReadedQuery(
                    this.notificationRepository,
                ),
                new NestLogger('CountNotificationsNotReaded'),
            ),
            (e) => new HttpException(e.message, 404),
        ).execute({
            client: user.id,
        })
        return result.unwrap()
    }
}
