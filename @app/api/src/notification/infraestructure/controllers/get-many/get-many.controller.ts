import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { GetNotificationsManyResponse } from 'src/notification/application/queries/many/types/response'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { GetNotificationsManyQuery } from 'src/notification/application/queries/many/notification.many.query'
import { Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { User } from 'src/user/infraestructure/decorators/user.decorator'

@Controller({
    path: 'notification',
    docTitle: 'Notification',
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
    @ApiHeader({
        name: 'auth',
    })
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
