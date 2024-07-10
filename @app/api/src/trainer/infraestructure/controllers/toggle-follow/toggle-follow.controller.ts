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
import { User as UserDecorator } from '../../decorators/user.decorator'
import { TrainerPostgresRepository } from '../../repositories/postgres/trainer.repository'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { UserGuard } from '../../guards/user.guard'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { CurrentUserResponse } from '../../auth/current/types/response'

@Controller({
    path: 'trainer',
    docTitle: 'Trainer',
    bearerAuth: true,
})
export class ToggleFollowController
implements
        ControllerContract<
            [param: string, user: CurrentUserResponse],
            ToggleFollowResponse
        >
{
    constructor(
        private trainerRepo: TrainerPostgresRepository,
        private eventPublisher: RabbitMQEventHandler,
    ) {}

    @Post('toggle/follow/:id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Param('id', ParseUUIDPipe) param: string,
        @UserDecorator() user: CurrentUserResponse,
    ): Promise<ToggleFollowResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new DomainErrorParserDecorator(
                    new ToggleFolowCommand(
                        this.trainerRepo,
                        this.eventPublisher,
                    ),
                ),
                new NestLogger('ToggleFollow'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({ userId: user.id, trainerId: param })
        return result.unwrap()
    }
}
