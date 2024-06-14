import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { MarkNotificationAsReadedResponse } from 'src/notification/application/commands/mark-readed/types/response'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { HttpException, Param, Put, UseGuards } from '@nestjs/common'
import { User } from 'src/user/infraestructure/decorators/user.decorator'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { MarkNotificationAsReadedCommand } from 'src/notification/application/commands/mark-readed/mark.notification.readed.command'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'

@Controller({
    path: 'notification',
    docTitle: 'Notification',
})
export class MarkReadedNotificationController
implements
        ControllerContract<
            [id: string, user: CurrentUserResponse],
            MarkNotificationAsReadedResponse
        >
{
    constructor(
        private notificationRepository: NotificationPostgresRepository,
    ) {}
    @Put('mark/:id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Param('id') id: string,
        @User() user: CurrentUserResponse,
    ): Promise<MarkNotificationAsReadedResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new MarkNotificationAsReadedCommand(
                    this.notificationRepository,
                ),
                new NestLogger('MarkReadedNotification'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({
            client: user.id,
            id,
        })
        return result.unwrap()
    }
}
