import {
    HttpException,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
} from '@nestjs/common'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ToggleFolowCommand } from 'src/trainer/application/commands/toggle-follow/toggle.follow.command'
import { ToggleFollowResponse } from 'src/trainer/application/commands/toggle-follow/types/response'
import { User } from 'src/user/application/models/user'
import { User as UserDecorator } from 'src/user/infraestructure/decorators/user.decorator'
import { TrainerPostgresRepository } from '../../repositories/postgres/trainer.repository'
import { FindTrainerQuery } from 'src/trainer/application/queries/find/find.trainer.query'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'

@Controller({
    path: 'trainer',
    docTitle: 'Trainer',
})
export class ToggleFollowController
    implements
        ControllerContract<[param: string, user: User], ToggleFollowResponse>
{
    constructor(private trainerRepo: TrainerPostgresRepository) {}

    @Post('toggle/follow/:id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Param('id', ParseUUIDPipe) param: string,
        @UserDecorator() user: User,
    ): Promise<ToggleFollowResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new ToggleFolowCommand(this.trainerRepo),
                new NestLogger('ToggleFollow'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({ userId: user.id, trainerId: param })
        return result.unwrap()
    }
}
