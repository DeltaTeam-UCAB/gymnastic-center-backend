import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { Get, HttpException, Param, UseGuards } from '@nestjs/common'
import { User } from 'src/user/infraestructure/decorators/user.decorator'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { MarkNotificationAsReadedCommand } from 'src/notification/application/commands/mark-readed/mark.notification.readed.command'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { GetNotificationByIdResponse } from 'src/notification/application/queries/get-id/types/response'
import { GetNotificationByIdQuery } from 'src/notification/application/queries/get-id/get.notification.id.query'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'

@Controller({
    path: 'notifications',
    docTitle: 'Notification',
    bearerAuth: true,
})
export class GetNotificationByIdController
implements
        ControllerContract<
            [id: string, user: CurrentUserResponse],
            GetNotificationByIdResponse
        >
{
    constructor(
        private notificationRepository: NotificationPostgresRepository,
    ) {}
    @Get('one/:id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Param('id') id: string,
        @User() user: CurrentUserResponse,
    ): Promise<GetNotificationByIdResponse> {
        await new ErrorDecorator(
            new LoggerDecorator(
                new MarkNotificationAsReadedCommand(
                    this.notificationRepository,
                ),
                new NestLogger('GetNotificationById'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({
            client: user.id,
            id,
        })
        const result = await new ErrorDecorator(
            new GetNotificationByIdQuery(this.notificationRepository),
            (e) => new HttpException(e.message, 404),
        ).execute({
            id,
        })
        return result.unwrap()
    }
}
