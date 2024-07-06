import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CountClientFollowsResponse } from 'src/trainer/application/queries/count-client-follows/types/response'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { TrainerPostgresRepository } from '../../repositories/postgres/trainer.repository'
import { Get, UseGuards } from '@nestjs/common'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { CountClientFollowsQuery } from 'src/trainer/application/queries/count-client-follows/count.client.follows.query'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { User } from 'src/user/infraestructure/decorators/user.decorator'

@Controller({
    path: 'trainer',
    docTitle: 'Trainer',
    bearerAuth: true,
})
export class CountTrainerFollowsController
    implements
        ControllerContract<
            [user: CurrentUserResponse],
            CountClientFollowsResponse
        >
{
    constructor(private trainerRepository: TrainerPostgresRepository) {}
    @Get('user/follow')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @User() user: CurrentUserResponse,
    ): Promise<CountClientFollowsResponse> {
        const result = await new LoggerDecorator(
            new CountClientFollowsQuery(this.trainerRepository),
            new NestLogger('Count client follows'),
        ).execute({
            clientId: user.id,
        })
        return result.unwrap()
    }
}
