import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { GetNotificationsManyResponse } from 'src/notification/application/queries/many/types/response'
import { CurrentUserResponse } from '../../auth/current/types/response'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { GetNotificationsManyQuery } from 'src/notification/application/queries/many/notification.many.query'
import { Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common'
import { UserGuard } from '../../guards/user.guard'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { User } from '../../decorators/user.decorator'

@Controller({
    path: 'notifications',
    docTitle: 'Notification',
    bearerAuth: true,
})
export class GetNotificationsController
    implements
        ControllerContract<
            [user: CurrentUserResponse, page: number, perPage: number],
            GetNotificationsManyResponse
        >
{
    constructor(
        private notificationRepository: NotificationPostgresRepository,
    ) {}
    @Get('many')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @User() user: CurrentUserResponse,
        @Query('page', ParseIntPipe) page: number,
        @Query('perPage', ParseIntPipe) perPage: number,
    ): Promise<GetNotificationsManyResponse> {
        const data = await new GetNotificationsManyQuery(
            this.notificationRepository,
        ).execute({
            page,
            perPage,
            client: user.id,
        })
        return data.unwrap()
    }
}
