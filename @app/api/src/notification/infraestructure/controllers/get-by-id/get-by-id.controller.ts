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
import { ApiHeader } from '@nestjs/swagger'
import { GetNotificationByIdResponse } from 'src/notification/application/queries/get-id/types/response'
import { GetNotificationByIdQuery } from 'src/notification/application/queries/get-id/get.notification.id.query'

@Controller({
    path: 'notification',
    docTitle: 'Notification',
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
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Param('id') id: string,
        @User() user: CurrentUserResponse,
    ): Promise<GetNotificationByIdResponse> {
        await new ErrorDecorator(
            new MarkNotificationAsReadedCommand(this.notificationRepository),
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
