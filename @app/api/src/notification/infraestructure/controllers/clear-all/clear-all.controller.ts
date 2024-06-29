import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { Delete, UseGuards } from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { User } from 'src/user/infraestructure/decorators/user.decorator'
import { ClearClientNotificationsCommand } from 'src/notification/application/commands/clear-by-client/clear.by.client.command'

@Controller({
    path: 'notifications',
    docTitle: 'Notification',
    bearerAuth: true,
})
export class ClearNotificationsController
    implements ControllerContract<[user: CurrentUserResponse], void>
{
    constructor(
        private notificationRepository: NotificationPostgresRepository,
    ) {}
    @Delete('delete/all')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(@User() user: CurrentUserResponse): Promise<void> {
        const data = await new ClearClientNotificationsCommand(
            this.notificationRepository,
        ).execute(user.id)
        return data.unwrap()
    }
}
